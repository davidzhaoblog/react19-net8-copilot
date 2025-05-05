// // the following code from:
// // https://medium.com/@enetoOlveda/how-to-use-axios-typescript-like-a-pro-7c882f71e34a

// import { AxiosResponse, AxiosRequestConfig, AxiosInterceptorManager } from 'axios';
// import { AxiosApiBase } from './AxiosApiBase';
// import { IBulkUpdateRequest } from './IBulkUpdateRequest';
// import { IListResponse } from './IListResponse';
// import { IMultiItemsCUDRequest } from './IMultiItemsCUDRequest';
// import { IResponse } from './IResponse';
// import { IResponseWithoutBody } from './IResponseWithoutBody';

// export class AxiosApiBaseGeneric<TDataModel, TIdentifierQuery, TAdvancedQuery, TCompositeModel, TCompareModel> extends AxiosApiBase {

//     protected url_Search: string;
//     protected url_Put: string;
//     protected url_Get: string;
//     protected url_Post: string;
//     protected url_Delete: string;
//     protected url_GetCompositeModel: string;
//     protected url_Compare: string;
//     protected url_BulkDelete: string;
//     protected url_BulkUpdate: string;
//     protected url_MultiItemsCUD: string;
//     protected url_CreateComposite: string;

//     public constructor(conf?: AxiosRequestConfig & { interceptors : {
//         request: AxiosInterceptorManager<AxiosRequestConfig>;
//         response: AxiosInterceptorManager<AxiosResponse>;
//     } }) {
//         super(conf);

//         // this middleware is been called right before the http request is made.
//         this.interceptors.request.use((param: AxiosRequestConfig) => ({
//             ...param,
//         }));

//         // this middleware is been called right before the response is get it by the method that triggers the request
//         this.interceptors.response.use((param: AxiosResponse) => ({
//             ...param
//         }));
//     }

//     public Search = (params: TAdvancedQuery): Promise<IListResponse<TDataModel[]>> => {
//         if (!!!this.url_Search) {
//             throw new Error('Search Api is not available');
//         }

//         return this.post<IListResponse<TDataModel[]>, TAdvancedQuery, AxiosResponse<IListResponse<TDataModel[]>>>(this.url_Search, params)
//             .then(this.success);
//     }

//     public Put = (identifier: TIdentifierQuery, params: TDataModel): Promise<IResponse<TDataModel>> => {
//         if (!!!this.url_Put) {
//             throw new Error('Put Api is not available');
//         }

//         return this.put<IResponse<TDataModel>, TDataModel, AxiosResponse<IResponse<TDataModel>>>(this.url_Put + '/' + this.convertParametersToWebApiRoute(identifier), params)
//             .then(this.success);
//     }

//     public Get = (identifier: TIdentifierQuery): Promise<IResponse<TDataModel>> => {
//         if (!!!this.url_Get) {
//             throw new Error('Get Api is not available');
//         }

//         return this.get<IResponse<TDataModel>, AxiosResponse<IResponse<TDataModel>>>(this.url_Get + '/' + this.convertParametersToWebApiRoute(identifier))
//             .then(this.success);
//     }

//     public Post = (params: TDataModel): Promise<IResponse<TDataModel>> => {
//         if (!!!this.url_Post) {
//             throw new Error('Post Api is not available');
//         }

//         return this.post<IResponse<TDataModel>, TDataModel, AxiosResponse<IResponse<TDataModel>>>(this.url_Post, params)
//             .then(this.success);
//     }

//     public Delete = (identifier: TIdentifierQuery): Promise<IResponseWithoutBody> => {
//         if (!!!this.url_Delete) {
//             throw new Error('Delete Api is not available');
//         }

//         return this.delete<IResponseWithoutBody>(this.url_Delete + '/' + this.convertParametersToWebApiRoute(identifier))
//             .then(this.success);
//     }

//     public GetCompositeModel = (identifier: TIdentifierQuery): Promise<TCompositeModel> => {
//         if (!!!this.url_GetCompositeModel) {
//             throw new Error('GetCompositeModel Api is not available');
//         }

//         return this.get<TCompositeModel, AxiosResponse<TCompositeModel>>(this.url_GetCompositeModel + '/' + this.convertParametersToWebApiRoute(identifier))
//             .then(this.success);
//     }
    
//     public Compare = (params: TAdvancedQuery): Promise<TCompareModel> => {
//         if (!!!this.url_Compare) {
//             throw new Error('Search Api is not available');
//         }

//         return this.post<TCompareModel, TAdvancedQuery, AxiosResponse<TCompareModel>>(this.url_Compare, params)
//             .then(this.success);
//     }

//     public BulkDelete = (identifiers: TIdentifierQuery[]): Promise<IResponseWithoutBody> => {
//         if (!!!this.url_BulkDelete) {
//             throw new Error('BulkDelete Api is not available');
//         }

//         return this.put<IResponseWithoutBody, TIdentifierQuery[], AxiosResponse<IResponseWithoutBody>>(this.url_BulkDelete, identifiers)
//             .then(this.success);
//     }

//     public BulkUpdate = (requestBody: IBulkUpdateRequest<TIdentifierQuery, TDataModel>): Promise<IListResponse<TDataModel[]>> => {
//         if (!!!this.url_BulkUpdate) {
//             throw new Error('BulkUpdate Api is not available');
//         }

//         return this.put<IListResponse<TDataModel[]>, IBulkUpdateRequest<TIdentifierQuery, TDataModel>, AxiosResponse<IListResponse<TDataModel[]>>>(this.url_BulkUpdate, requestBody)
//             .then(this.success);
//     }

//     public MultiItemsCUD = (requestBody: IMultiItemsCUDRequest<TIdentifierQuery, TDataModel>): Promise<IResponse<IMultiItemsCUDRequest<TIdentifierQuery, TDataModel>>> => {
//         if (!!!this.url_MultiItemsCUD) {
//             throw new Error('MultiItemsCUD Api is not available');
//         }

//         return this.put<IResponse<IMultiItemsCUDRequest<TIdentifierQuery, TDataModel>>, IMultiItemsCUDRequest<TIdentifierQuery, TDataModel>, AxiosResponse<IResponse<IMultiItemsCUDRequest<TIdentifierQuery, TDataModel>>>>(this.url_MultiItemsCUD, requestBody)
//             .then(this.success);
//     }

//     public CreateComposite = (params: TCompositeModel): Promise<IResponse<TDataModel>> => {
//         if (!!!this.url_CreateComposite) {
//             throw new Error('CreateComposite Api is not available');
//         }

//         return this.post<IResponse<TDataModel>, TCompositeModel, AxiosResponse<IResponse<TDataModel>>>(this.url_CreateComposite, params)
//             .then(this.success);
//     }
    
// }
