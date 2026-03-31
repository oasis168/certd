export class AbstractPlusTaskPlugin {
  [key: string]: any;
  async onInstance(): Promise<void> {}
  async execute(): Promise<void> {}
}

export class SynologyClient {
  private access: any;
  private http: any;
  private logger: any;
  private skipSslVerify: boolean;

  constructor(access: any, http?: any, logger?: any, skipSslVerify?: boolean) {
    if (typeof access === "object" && http === undefined && access.http) {
      this.access = access.access || access;
      this.http = access.http;
      this.logger = access.logger;
      this.skipSslVerify = access.skipSslVerify || false;
    } else {
      this.access = access;
      this.http = http;
      this.logger = logger;
      this.skipSslVerify = skipSslVerify || false;
    }
  }

  async doLogin(): Promise<void> {}
  async doLoginWithOTPCode(otpCode: string): Promise<any> { return {}; }
  async getCertList(): Promise<any> { return []; }
}

export class XinnetClient {
  private opts: any;
  constructor(opts: { access: any; logger: any; http: any }) {
    this.opts = opts;
  }
  async getDomainList(params: { pageNo: number; pageSize: number }): Promise<any> {
    return { list: [], total: 0 };
  }
}

export class MaoyunClient {
  private opts: any;
  constructor(opts: { http: any; logger: any; access: any }) {
    this.opts = opts;
  }
  async login(): Promise<void> {}
  async doRequest(config: { url: string; data?: any; params?: any; method?: string }): Promise<any> {
    return {};
  }
}

export class UniCloudClient {
  private opts: any;
  constructor(opts: { access: any; logger: any; http: any }) {
    this.opts = opts;
  }
  async getToken(): Promise<any> { return {}; }
}
