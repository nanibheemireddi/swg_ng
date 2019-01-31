/*
 * placing the Default messages
 */
module.exports = {
    common: {
        error: {
            noToken: {
                msg: 'No token provided.'
            },
            dataAdd: {
                msg: 'Some Error while adding !'
            },
            invalidSchema: {
                msg: 'Selection of Invalid Schema !'
            },
            dataNotFound: {
                msg: 'Data Not Found.'
            },
            payloadError: {
                msg: 'Some went wrong, Please try again!'
            },
            pageNotFound: {
                msg: "Oops, Requested page not found."
            },
            unique: {
                msg: "must be Unique ."
            }
        }
    },
    users: {
        error: {
            dataNotFound: {
                msg: "No user available"
            },
            invalidCredencials: {
                msg: "Email or password is incorrect."
            },
            accountDeactivate: {
                msg: "your account is Deactivated , please contact admin."
            },
            activateAccount: {
                msg: "please activate your account to login"
            },
            invalidVerificationLink: {
                msg: "Verification link is invalid."
            }
        },
        success: {
            dataUpdated: {
                msg: "user details has been updated."
            },
            dataDeleted: {
                msg: "user has been deleted."
            },
            userCreated: {
                msg: "user has been created"
            },
            validVerificationLink: {
                msg: "Verification link is valid."
            },
            activateAccountSuccess: {
                msg: "Your account has been activated successfully"
            }
        }
    },
    company: {
        error: {
            dataNotFound: {
                msg: "No company available"
            },
        },
        success: {
            dataAdded: {
                msg: "company has been added."
            },
            dataUpdated: {
                msg: "company has been updated."
            },
            dataDeleted: {
                msg: "company has been deleted."
            }
        },
        unique: {
            msg: 'should be Unique.'
        }
    },
    customers: {
        error: {
            dataNotFound: {
                msg: "No customers available ."
            }
        },
        success: {
            dataAdded: {
                msg: "customer has been added."
            },
            dataUpdated: {
                msg: "customer has been updated."
            },
            delete: {
                msg: "customer has been deleted."
            },
        }
    },
    companyBrand: {
        error: {
            dataNotFound: {
                msg: "No entity available ."
            },
            unique :{
                msg : "company Brand is already added under this company!"
            }
        },
        success: {
            dataAdded: {
                msg: "entity has been added."
            },
            dataUpdated: {
                msg: "entity has been updated."
            },
            delete: {
                msg: "Brand Deleted Successfully ."
            }
        }
    },
    project: {
        error: {
            dataNotFound: {
                msg: "No project available"
            },
        },
        success: {
            dataAdded: {
                msg: "project has been added."
            },
            dataUpdated: {
                msg: "project has been updated."
            },
        }
    },
    roles: {
        error: {
            dataNotFound: {
                msg: "No userGroup available"
            },
        },
        success: {
            dataAdded: {
                msg: "userGroup has been added."
            },
            dataUpdated: {
                msg: "userGroup has been updated."
            },
            dataDeleted: {
                msg: "userGroup has been deleted."
            },
        }
    },
    uploads: {
        error: {
            something: {
                msg: "Something Error while uploading a file ."
            }
        }
    }
}