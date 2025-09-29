

import BackendUrl from "@/libs/BackendUrl";

export default function ProjectApiList() {
  const baseUrl = BackendUrl;
  const apiList = {

    api_Register: `${baseUrl}/api/users/register`,
    api_updateUser: `${baseUrl}/api/profile/business`,
    api_Login: `${baseUrl}/api/users/login`,
    api_getAdminDashboard: `${baseUrl}/api/dashboard/counts`,


    //chat apis

    api_get_user_chats:`${baseUrl}/api/chat/user`,
    api_get_user_messages:`${baseUrl}/api/chat`,
    api_send_message: `${baseUrl}/api/chat/message`,
    api_initiate_chat: `${baseUrl}/api/chat/initiate`,

    //user apis
    api_get_all_users: `${baseUrl}/api/users/get`,
    api_get_user_data: `${baseUrl}/api/users/me`,
    
    // post
    api_postFeed: `${baseUrl}/api/posts/feed`,
    api_getApprovedPost: `${baseUrl}/api/posts/feed/get-by-status`,
    api_getPostByID: `${baseUrl}/api/posts/feed/get-by-id`,
    api_updatePostStatus: `${baseUrl}/api/posts/feed`,
    
    // product
    api_addProduct: `${baseUrl}/api/product/add`,
    api_getProduct: `${baseUrl}/api/product/get`,
    api_getOthersProduct: `${baseUrl}/api/product/approved/by-user`,
    api_getProductById: `${baseUrl}/api/product/get`,
    api_updateProduct: `${baseUrl}/api/product/update`,
    api_postProductApprove: `${baseUrl}/api/product/approve`,
    api_postProductRejected: `${baseUrl}/api/product/reject`,

    api_getAdminProducts: `${baseUrl}/api/product/products`,
    
    //user 
    api_getUserData: `${baseUrl}/api/users/me`,
    api_getProfileCardData: `${baseUrl}/api/profile/card`,
    api_getOtherUserData: `${baseUrl}/api/users/get`,
    api_getOtherUserDataBan: `${baseUrl}/api/users/ban`,
    api_getOtherUserDataUnBan: `${baseUrl}/api/users/unban`,
    api_getOtherUserDataFeeDefaulter: `${baseUrl}/api/deafulter/payments/request`,
    api_getOtherUserDataRemoveFeeDefaulter: `${baseUrl}/api/deafulter/payments/toggle`,
    api_getNewUserData: `${baseUrl}/api/users/get-new`,
    api_getNewMatrimonialRequest: `${baseUrl}/api/users/get-new-user`,
    api_getNewUserDataId: `${baseUrl}/api/users/get`,
    api_getAllUser: `${baseUrl}/api/users/approved-users/filter`,
    api_postApproveUser: `${baseUrl}/api/users/approve`,
    api_postApproveMatrimonial: `${baseUrl}/api/users/matrimonial-access`,
    api_postApprovePaymentDefaulter: `${baseUrl}/api/deafulter/payments/approve`,
    
    //referral
    api_postReferrals: `${baseUrl}/api/referal/send`,
    api_getReferrals: `${baseUrl}/api/referal/received`,
    api_postPoints: `${baseUrl}/api/referal/accept`,
    api_givePoints: `${baseUrl}/api/referal/give-points`,

    
    //referral
    api_getupcommingEvents: `${baseUrl}/api/events/upcoming`,
    api_getupcommingEventbyId: `${baseUrl}/api/events/get-by-id`,
    api_getCompletedEvents: `${baseUrl}/api/events/completed`,
    api_postRegisterEvents: `${baseUrl}/api/events/register`,

    
    // craete events
    api_postCreateEvents: `${baseUrl}/api/events/create`,
    api_getEventListings: `${baseUrl}/api/events/`,
    api_getEventById: `${baseUrl}/api/events/get-by-id`,
    api_getEventRegistrations: `${baseUrl}/api/events`,
    api_postEventVerification: `${baseUrl}/api/events/verify`,
    api_deleteEvent: `${baseUrl}/api/events/delete`,

  };

  return apiList;
}
