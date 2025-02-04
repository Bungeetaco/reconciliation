import { Client } from '@microsoft/microsoft-graph-client';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { PublicClientApplication, AccountInfo, InteractionRequiredAuthError, InteractionType } from '@azure/msal-browser';
import { loginRequest, graphConfig } from '../lib/auth-config';
import { User as MicrosoftGraphUser, SubscribedSku } from '@microsoft/microsoft-graph-types';

interface License {
  skuId: string;
}

interface UserWithLicenses extends MicrosoftGraphUser {
  assignedLicenses: License[];
}

export class GraphService {
  private graphClient: Client | null = null;
  private account: AccountInfo | null = null;

  constructor(private msalInstance: PublicClientApplication) {}

  private async ensureAccount() {
    if (!this.account) {
      const currentAccounts = this.msalInstance.getAllAccounts();
      if (currentAccounts.length === 0) {
        // No accounts found, need to login
        await this.msalInstance.loginPopup(loginRequest);
        this.account = this.msalInstance.getAllAccounts()[0];
      } else {
        this.account = currentAccounts[0];
      }
      this.msalInstance.setActiveAccount(this.account);
    }
    return this.account;
  }

  private async getGraphClient(): Promise<Client> {
    if (!this.graphClient) {
      await this.ensureAccount();
      
      const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(
        this.msalInstance,
        {
          account: this.account as AccountInfo,
          scopes: loginRequest.scopes,
          interactionType: InteractionType.Popup
        }
      );

      this.graphClient = Client.initWithMiddleware({
        authProvider
      });
    }
    return this.graphClient;
  }

  async getUserProfile() {
    try {
      const client = await this.getGraphClient();
      return await client.api(graphConfig.graphMeEndpoint).get();
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        await this.msalInstance.loginPopup(loginRequest);
        const client = await this.getGraphClient();
        return await client.api(graphConfig.graphMeEndpoint).get();
      }
      throw error;
    }
  }

  async getAllUsers(): Promise<UserWithLicenses[]> {
    try {
      const client = await this.getGraphClient();
      const response = await client
        .api(graphConfig.graphUsersEndpoint)
        .select('id,displayName,userPrincipalName,department,assignedLicenses')
        .get();
      return response.value;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        await this.msalInstance.loginPopup(loginRequest);
        const client = await this.getGraphClient();
        const response = await client
          .api(graphConfig.graphUsersEndpoint)
          .select('id,displayName,userPrincipalName,department,assignedLicenses')
          .get();
        return response.value;
      }
      throw error;
    }
  }

  async getLicenses(): Promise<SubscribedSku[]> {
    try {
      const client = await this.getGraphClient();
      const response = await client
        .api(graphConfig.graphLicensesEndpoint)
        .get();
      return response.value;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        await this.msalInstance.loginPopup(loginRequest);
        const client = await this.getGraphClient();
        const response = await client
          .api(graphConfig.graphLicensesEndpoint)
          .get();
        return response.value;
      }
      throw error;
    }
  }

  async getUsersWithLicenses() {
    try {
      const [users, licenses] = await Promise.all([
        this.getAllUsers(),
        this.getLicenses()
      ]);

      const licenseMap = new Map(
        licenses.map(license => [license.skuId, license])
      );

      return users.map(user => ({
        displayName: user.displayName,
        userPrincipalName: user.userPrincipalName,
        department: user.department || 'No Department',
        licenses: user.assignedLicenses.map(license => ({
          guid: license.skuId,
          productName: licenseMap.get(license.skuId)?.skuPartNumber || 'Unknown License'
        }))
      }));
    } catch (error) {
      console.error('Error fetching users with licenses:', error);
      throw error;
    }
  }
} 