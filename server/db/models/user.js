const crypto = require("crypto");
const Sequelize = require("sequelize");
const db = require("../db");

const User = db.define(
	"user",
	{
		firstName: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: { 
				is: {
					args: ["^[a-z\-]+$",'i'],
					msg: "Must be a legal name"
				} //HM Passport Office will not print numerals (0–9) on a passport — only alphabetical characters (A–Z), hypens and apostrophes.  If you have a number in your name and it appears on your original birth certificate, HM Passport Office will write out the number alphabetically, for example, as Super Eight or Four Real.  However names containing numbers on a deed poll will be refused.
			}
		},
		lastName: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				is: {
					args: ["^[a-z\-]+$",'i'],
					msg: "Must be a legal name"
				} //HM Passport Office will not print numerals (0–9) on a passport — only alphabetical characters (A–Z), hypens and apostrophes.  If you have a number in your name and it appears on your original birth certificate, HM Passport Office will write out the number alphabetically, for example, as Super Eight or Four Real.  However names containing numbers on a deed poll will be refused.
			}
		},
		email: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false,
			validate: {
				isEmail: {
					args: true,
					msg: "Must be a valid email"
				}
			}
		},
		password: {
			type: Sequelize.STRING,
			get() {
				return () => this.getDataValue("password");
			},
			allowNull: false,
			validate: {
				// password check for deployment:
				validPw(value) {
          
					switch (true) {
						case (!value.match(/[0-9]/)):
              				throw new Error(
								"Password must include at least one number"
							);
						case !value.match(/[!@#$%^&*]/):
							throw new Error(
								"Password must include at least one special character"
							);
						case !value.match(/[A-Z]/):
							throw new Error(
								"Password must include at least one upper case character"
							);
						case !value.match(/[a-z]/):
							throw new Error(
								"Password must include at least one lower case character"
							);
						case !!value.match(/[;<>]/):
							throw new Error(
								"Password must not include illegal characters"
							);
					}
				},
				len: {
					args: [6, 15],
					msg: "Password must be between 6 and 15 characters"
        }
        	// simple password check for dev:

				// isAlphanumeric:
				//   {
				//     args:true,
				//     msg: "Password can only contain valid letters and numbers"
				//   },
				
			},
		},
		userName: {
			type: Sequelize.STRING,
			defaultValue: "YourUsername",
			validate: {
				len: {
					args: [5, 15],
					msg: "Username must be between 5 and 15 characters long"
				},
				isAlphanumeric: {
					args: true,
					msg: "Username can only contain valid letters and numbers"
				}
			}
		},
		apt: {
			type: Sequelize.STRING,
			defaultValue: "",
			validate: {
				validAdd(value) {
					if (value.match(/[;<>]/)) {
						throw new Error(
							"Address must not include illegal characters"
						);
					}
				}
			}
		},
		houseNumber: {
			type: Sequelize.STRING, //https://en.wikipedia.org/wiki/House_numbering
			defaultValue: "",
			validate: {
				validAdd(value) {
					if (value.match(/[;<>]/)) {
						throw new Error(
							"Address must not include illegal characters"
						);
					}
				}
			}
		},
		street: {
			type: Sequelize.STRING,
			defaultValue: "",
			validate: {
				validAdd(value) {
					if (value.match(/[;<>]/)) {
						throw new Error(
							"Address must not include illegal characters"
						);
					}
				}
			}
		},
		zipcode: {
			type: Sequelize.STRING, //https://www.postalcodesincanada.com/
			defaultValue: "",
			validate: {
				validAdd(value) {
					if (value.match(/[;<>]/)) {
						throw new Error(
							"Address must not include illegal characters"
						);
					}
				}
			}
		},
		state: {
			type: Sequelize.STRING,
			defaultValue: "",
			validate: {
				validAdd(value) {
					if (value.match(/[;<>]/)) {
						throw new Error(
							"Address must not include illegal characters"
						);
					}
				}
			}
		},
		city: {
			type: Sequelize.STRING,
			defaultValue: "",
			validate: {
				validAdd(value) {
					if (value.match(/[;<>]/)) {
						throw new Error(
							"City name must not include illegal characters"
						);
					}
				},
			}
		},
		country: {
			type: Sequelize.STRING,
			defaultValue: "",
			validate: {
				validAdd(value) {
					if (value.match(/[;<>]/)) {
						throw new Error(
							"Country name must not include illegal characters"
						);
					}
				},
				is: {
					args: /^[a-z\.\ ]*$/i,
					msg: "Must be a valid country"
				}
			}
		},
		address: {
			type: Sequelize.STRING,
			validate: {
				validAdd(value) {
					if (value.match(/[;<>]/)) {
						throw new Error(
							"Address must not include illegal characters"
						);
					}
				}
			}
		},
		bankrollDollars: {
			type: Sequelize.INTEGER,
			defaultValue: 5000,
		},
		bankrollCents: {
			type: Sequelize.INTEGER,
			defaultValue: 0,
		},
		admin: {
			type: Sequelize.BOOLEAN,
			defaultValue: false
		},
		salt: {
			type: Sequelize.STRING,
			get() {
				return () => this.getDataValue("salt");
			}
		},
		googleId: {
			type: Sequelize.STRING
		}
	},
	{
		hooks: {
			beforeCreate: user => {
				let userAddress=[]
				let addressValues = [user.apt, user.houseNumber, user.street, user.city, user.zipcode, user.state, user.country]
				addressValues.forEach(entry => {
					if(entry.length) userAddress.push(entry)
				})
				user.address = userAddress.join(", ")
			},
			beforeUpdate: user => {
				let userAddress=[]
				let addressValues = [user.apt, user.houseNumber, user.street, user.city, user.zipcode, user.state, user.country]
				addressValues.forEach(entry => {
					if(entry.length) userAddress.push(entry)
				})
				user.address = userAddress.join(", ")
			},
			
		}
	}
);

module.exports = User;

/**
 * instanceMethods
 */
User.prototype.correctPassword = function(candidatePwd) {
	return User.encryptPassword(candidatePwd, this.salt()) === this.password();
};

/**
 * classMethods
 */
User.generateSalt = function() {
	return crypto.randomBytes(16).toString("base64");
};

User.encryptPassword = function(plainText, salt) {
	return crypto
		.createHash("RSA-SHA256")
		.update(plainText)
		.update(salt)
		.digest("hex");
};

/**
 * hooks
 */
const setSaltAndPassword = user => {
	if (user.changed("password")) {
		user.salt = User.generateSalt();
		user.password = User.encryptPassword(user.password(), user.salt());
	}
};

User.beforeCreate(setSaltAndPassword);
User.beforeUpdate(setSaltAndPassword);
User.beforeBulkCreate(users => {
	users.forEach(setSaltAndPassword);
});
