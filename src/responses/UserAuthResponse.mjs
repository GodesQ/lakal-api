export default class UserAuthResponse {
    constructor(user, userInfo) {
        this.uid = user.uid,
        this.email = user.email,
        this.emailVerified = user.emailVerified,
        this.tokens = {
            refreshToken: user.refreshToken,
            accessToken: user.stsTokenManager.accessToken,
        },
        this.roles = [userInfo.roles],
        this.activeRole = userInfo.activeRole
    }
}