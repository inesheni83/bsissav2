// Two-factor authentication routes (stubbed - feature currently disabled)

export const show = {
    url: () => '/settings/two-factor',
};

export const enable = {
    url: () => '/settings/two-factor/enable',
};

export const disable = {
    url: () => '/settings/two-factor/disable',
};

export const confirm = {
    url: () => '/settings/two-factor/confirm',
};

export const qrCode = {
    url: () => '/settings/two-factor/qr-code',
};

export const secretKey = {
    url: () => '/settings/two-factor/secret-key',
};

export const recoveryCodes = {
    url: () => '/settings/two-factor/recovery-codes',
};

export const regenerateRecoveryCodes = {
    url: () => '/settings/two-factor/recovery-codes/regenerate',
};
