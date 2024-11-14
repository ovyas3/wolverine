export const environment = {
    DEV_API_URL:(service:string) => `https://dev-api.instavans.com/api/${service}/v1/`,
    PROD_API_URL:(service:string) => `https://prod-api.instavans.com/api/${service}/v1/`
}