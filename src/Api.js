// import axios from 'axios';
// export const BASE_URL = `https://wg5qsmzpynesniup6lduegpcom.appsync-api.ap-southeast-1.amazonaws.com/graphql`;

// function returnAxiosInstance() {
//   const axiosInstance = axios.create({
//     baseURL: BASE_URL,
//     // timeout: 1000 * 20 // default is `0` (no timeout) 20 seconds 1000*20
//   });

//   // Setting headers for authorization. You can do this in instances or interceptors
//   // https://stackoverflow.com/questions/45578844/how-to-set-header-and-options-in-axios
//   const accessToken = getToken();
//   if (accessToken) {
//     // Set for all requests (common) , or should we just do for post?
//     axiosInstance.defaults.headers.common['Authorization'] =
//       'Bearer ' + accessToken;
//   }

//   return axiosInstance;
// }

// export function post(url = '/', updateItemMasterData) {
//   if (!checkToken()) return;
//   const axios = returnAxiosInstance();
//   return axios.post(url, requestData);
// }

// export const updateItemMasterData = `
// mutation Mutation($input: UpdateItemInput!) {
//   updateItem(input: $input) {
//     id
//     internalID
//     isInventory
//     isSales
//     isPurchase
//     name
//     description
//     itemType
//     imageURLList
//     tagList
//     itemCategoryID
//     isActive
//     listSaleUOMCustom {
//       uomID
//       width
//       height
//       length
//       weight
//       lengthUOM
//       widthUOM
//       heightUOM
//       weightUOM
//     }
//     uomGroupID
//     inventoryUOMID
//     purchaseUOMID
//     saleUOMID
//     saleUnitPrice
//     saleMaximumDiscount
//     purchaseUnitPrice
//     preferredVendorID
//     purchaseMinOrderQty
//     itemValuation
//     defaultWarehouseID
//     inventoryMinQty
//     itemPropertyList {
//       id
//       name
//       internalID
//       type
//       description
//       value
//     }
//   }
// }
// `;
