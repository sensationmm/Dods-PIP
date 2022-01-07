type appEnabled = { enabled: (rule: string) => boolean };

export class OpenApiAdaptedRequest {
  public path: string;
  public baseUrl: string = '';
  public originalParams: Record<string, any>;
  public app: appEnabled = {
    enabled: (rule: string) => {
      if (rule === 'strict routing') {
        return false;
      }
      return true;
    }
  };

  constructor(
    public originalUrl: string,
    public method: string,
    public headers: Record<string, any>,
    public query: Record<string, any>,
    public body: any,
    public params: Record<string, any>,
    public openapi: {
      openApiRoute: string,
      expressRoute: string,
      schema: any,
      pathParams: {}
    }
  ) {
    this.originalUrl = `/api${originalUrl}`
    this.path = openapi.expressRoute;
    this.originalParams = params;
  }
};