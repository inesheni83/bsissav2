import SiteSettingsController from './SiteSettingsController'
import ProfileController from './ProfileController'
import PasswordController from './PasswordController'
import TwoFactorAuthenticationController from './TwoFactorAuthenticationController'
const Settings = {
    SiteSettingsController: Object.assign(SiteSettingsController, SiteSettingsController),
ProfileController: Object.assign(ProfileController, ProfileController),
PasswordController: Object.assign(PasswordController, PasswordController),
TwoFactorAuthenticationController: Object.assign(TwoFactorAuthenticationController, TwoFactorAuthenticationController),
}

export default Settings