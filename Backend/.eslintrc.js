module.exports = {
    "extends": "airbnb-base",
    // Indent with 4 spaces
    "rules": {
        "indent": ["error", 4],
        // Ignore unused vars for Express middleware
        "no-unused-vars": ["error", { "argsIgnorePattern": "next" }],
        // 0 - turn off, 1 - warning on use, 2 - error on use
        "no-console": 0,
        "no-underscore-dangle": [2, { "allow": ['_id', '__v'] }]
    },
};