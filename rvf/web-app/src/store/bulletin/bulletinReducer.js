import BULLETIN_CONSTS from "./bulletinConst";

const initialState = {
  error: "",
  loading: false,
};

const Bulletin = (state, action) => {
  if (typeof state === "undefined") {
    state = initialState;
  }
  switch (action.type) {
    case BULLETIN_CONSTS.ADD_BULLETIN_REQUEST:
      return {
        ...state,
        isAddBulletinRequesting: true,
        addBulletinData: false,
        addBulletinDataError: false,
        addBulletinDataNetworkError: false,
      };

    case BULLETIN_CONSTS.ADD_BULLETIN_SUCCESS:
      return {
        ...state,
        isAddBulletinRequesting: false,
        addBulletinData: action.payload.response,
        addBulletinDataError: false,
        addBulletinDataNetworkError: false,
      };

    case BULLETIN_CONSTS.ADD_BULLETIN_FAILED:
      return {
        ...state,
        isAddBulletinRequesting: false,
        addBulletinData: false,
        addBulletinDataError: action.payload.error ? false : action.payload.response,
        addBulletinDataNetworkError: action.payload.error ? action.payload.error : false,
      };
    case BULLETIN_CONSTS.GET_BULLETIN_REQUEST:
      return {
        ...state,
        isGetBulletinRequesting: true,
        getBulletinData: false,
        getBulletinDataError: false,
        getBulletinDataNetworkError: false,
      };
    case BULLETIN_CONSTS.GET_BULLETIN_SUCCESS:
      return {
        ...state,
        isGetBulletinRequesting: false,
        getBulletinData: action.payload.response,
        getBulletinDataError: false,
        getBulletinDataNetworkError: false,
      };
    case BULLETIN_CONSTS.GET_BULLETIN_FAILED:
      return {
        ...state,
        isGetBulletinRequesting: false,
        getBulletinData: false,
        getBulletinDataError: action.payload.error ? false : action.payload.response,
        getBulletinDataNetworkError: action.payload.error ? action.payload.error : false,
      };
    case BULLETIN_CONSTS.SHARE_BULLETIN_REQUEST:
      return {
        ...state,
        isShareBulletinRequesting: true,
        shareBulletinData: false,
        shareBulletinDataError: false,
        shareBulletinDataNetworkError: false,
      };
    case BULLETIN_CONSTS.SHARE_BULLETIN_SUCCESS:
      return {
        ...state,
        isShareBulletinRequesting: false,
        shareBulletinData: action.payload.response,
        shareBulletinDataError: false,
        shareBulletinDataNetworkError: false,
      };
    case BULLETIN_CONSTS.SHARE_BULLETIN_FAILED:
      return {
        ...state,
        isShareBulletinRequesting: false,
        shareBulletinData: false,
        shareBulletinDataError: action.payload.error ? false : action.payload.response,
        shareBulletinDataNetworkError: action.payload.error ? action.payload.error : false,
      };
    case BULLETIN_CONSTS.MAIL_LIST_REQUEST:
      return {
        ...state,
        isMailRequesting: true,
        mailListData: false,
        mailListDataError: false,
        mailListDataNetworkError: false,
      };
    case BULLETIN_CONSTS.MAIL_LIST_SUCCESS:
      return {
        ...state,
        isMailRequesting: false,
        mailListData: action.payload?.response,
        mailListDataError: false,
        mailListDataNetworkError: false,
      };
    case BULLETIN_CONSTS.MAIL_LIST_FAILED:
      return {
        ...state,
        isMailRequesting: false,
        mailListData: false,
        mailListDataError: action.payload.error ? false : action.payload.response,
        mailListDataNetworkError: action.payload.error ? action.payload.error : false,
      };
    default:
      return state;
  }
};

export default Bulletin;
