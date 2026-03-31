import { Provide, Scope, ScopeEnum } from "@midwayjs/core";

// --- Entities ---

export class UserSuiteEntity {
  id: number;
  userId: number;
  suiteId: number;
  pipelineCount: number;
  domainCount: number;
  deployCount: number;
  monitorCount: number;
  expireTime: number;
  [key: string]: any;
}

export const commercialEntities: any[] = [];

// --- Interfaces ---

export interface IUsedCountService {
  getUsedCount(userId: number): Promise<{
    pipelineCountUsed: number;
    domainCountUsed: number;
    monitorCountUsed: number;
  }>;
}

export type UpdateTradeInfo = {
  tradeNo: string;
  status?: string;
  amount?: number;
  payNo?: string;
  payTime?: number;
  remark?: string;
};

export type UpdateTrade = (data: UpdateTradeInfo) => Promise<void>;

export class TradeEntity {
  id: number;
  tradeNo: string;
  title: string;
  amount: number;
  status: string;
  userId: number;
  payNo: string;
  payTime: number;
  [key: string]: any;
}

export interface IPaymentProvider {
  getDetail(tradeNo: string): Promise<UpdateTradeInfo>;
  createOrder(
    trade: TradeEntity,
    opts: { bindUrl: string; clientIp: string }
  ): Promise<{ url?: string; qrcode?: string; body?: any }>;
  onNotify(data: any, updateTrade: UpdateTrade): Promise<string>;
}

class PaymentProviderFactory {
  private providers: Map<string, () => Promise<any>> = new Map();

  registerProvider(name: string, factory: () => Promise<any>) {
    this.providers.set(name, factory);
  }

  async getProvider(name: string): Promise<any> {
    const factory = this.providers.get(name);
    if (!factory) {
      throw new Error(`Payment provider ${name} not found`);
    }
    return await factory();
  }
}

export const paymentProviderFactory = new PaymentProviderFactory();

// --- UserSuiteService ---

@Provide("simpleUserSuiteService")
@Scope(ScopeEnum.Request, { allowDowngrade: true })
export class UserSuiteService {
  async presentGiftSuite(userId: number): Promise<void> {}

  async getSuiteSetting(): Promise<{ enabled: boolean; [key: string]: any }> {
    return { enabled: false };
  }

  async getMySuiteDetail(userId: number): Promise<any> {
    return {
      pipelineCount: { max: -1, used: 0 },
      domainCount: { max: -1, used: 0 },
      deployCount: { max: -1, used: 0 },
      monitorCount: { max: -1, used: 0 },
    };
  }

  async checkHasDeployCount(userId: number): Promise<UserSuiteEntity> {
    return new UserSuiteEntity();
  }

  async consumeDeployCount(suite: UserSuiteEntity, count: number): Promise<void> {}
}

// --- Midway component export ---
export const Configuration = class {};

