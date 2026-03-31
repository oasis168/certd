export const AppKey = "certd-open";

const plusInfo: PlusInfo = {
  isPlus: true,
  isComm: true,
  vipType: "comm",
  originVipType: "comm",
  expireTime: -1, // -1 = 永久
  secret: "",
};

export type PlusInfo = {
  isPlus: boolean;
  isComm: boolean;
  vipType: string;
  originVipType?: string;
  expireTime: number;
  secret?: string;
};

export function isPlus(): boolean {
  return true;
}

export function isComm(): boolean {
  return true;
}

export function checkPlus(): void {
  // always pass
}

export function checkComm(): void {
  // always pass
}

export function getPlusInfo(): PlusInfo {
  return { ...plusInfo };
}

export class PlusRequestService {
  private opts: any;

  constructor(opts: {
    subjectId: string;
    bindUrl?: string;
    bindUrl2?: string;
    installTime?: number;
    saveLicense?: (license: string) => Promise<void>;
  }) {
    this.opts = opts;
  }

  getSubjectId(): string {
    return this.opts.subjectId;
  }

  getBaseURL(): string {
    return "";
  }

  async active(code: string, inviteCode?: string): Promise<any> {
    return { license: "local-plus-active" };
  }

  async updateLicense(data: { license: string }): Promise<void> {}

  async verify(data: { license: string }): Promise<void> {}

  async bindUrl(url: string, url2?: string): Promise<any> {
    return {};
  }

  async register(): Promise<void> {}

  async requestWithoutSign(config: any): Promise<any> {
    return {};
  }

  async request(config: any): Promise<any> {
    return {};
  }

  async getAccessToken(): Promise<{ accessToken: string; expiresIn: number }> {
    return { accessToken: "local-token", expiresIn: Date.now() + 86400000 };
  }

  async getOrderCount(): Promise<any> {
    return 0;
  }
}
