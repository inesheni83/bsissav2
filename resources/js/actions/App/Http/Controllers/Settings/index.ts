import SiteSettingsController from './SiteSettingsController'
import ProfileController from './ProfileController'
import PasswordController from './PasswordController'
const Settings = {
    SiteSettingsController: Object.assign(SiteSettingsController, SiteSettingsController),
ProfileController: Object.assign(ProfileController, ProfileController),
PasswordController: Object.assign(PasswordController, PasswordController),
}

export default Settings