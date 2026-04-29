const z = require("zod");

const emailField = z.preprocess(
  (val) => (val === undefined ? "" : val),
  z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email format" })
    .max(50, { message: "Email must not exceed 50 characters" })
);
const usernameField = z.preprocess(
  (val) => (val === undefined ? "" : val),
  z
    .string({ required_error: "Username is required" })
    .trim()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "username is too long" })
);
const phoneField = z.preprocess(
  (val) => (val === undefined ? "" : val),
  z
    .string()
    .regex(/^01[0-2,5]{1}[0-9]{8}$/, {
      message:
        "Phone number must be a valid Egyptian number (starts with 010, 011, 012, or 015) and contain 11 digits",
    })
    .or(z.literal(""))
);
const firstNameField = z.preprocess(
  (val) => (val === undefined ? "" : val),
  z
    .string()
    .trim()
    .min(3, { message: "First name must be at least 3 characters long" })
    .max(50, { message: "first name is too long" })
    .or(z.literal(""))
);
const lastNameField = z.preprocess(
  (val) => (val === undefined ? "" : val),
  z
    .string()
    .trim()
    .min(3, { message: "Last name must be at least 3 characters long" })
    .max(50, { message: "last name is too long" })
    .or(z.literal(""))
);

const addressField = z.preprocess(
  (val) => (val === undefined ? "" : val),
  z.string().optional().or(z.literal(""))
);

const aboutField = z.preprocess(
  (val) => (val === undefined ? "" : val),
  z.string().or(z.literal(""))
);

const birthDateField = z.preprocess((val) => {
  if (val === "" || val === null || val === undefined) return undefined;
  return new Date(val);
}, z.date().optional());

const interestsField = z.preprocess(
  (val) => (val === undefined ? [] : val),
  z.array(z.string())
);

const achievementsField = z.preprocess(
  (val) => (val === undefined ? [] : val),
  z.array(
    z.object({
      title: z.string(),
      dateEarned: z.preprocess(
        (val) =>
          typeof val == "string" || val instanceof Date ? new Date(val) : val,
        z.date()
      ),
    })
  )
);

const editUserProfileSchema = z.object({
  firstName: firstNameField,
  lastName: lastNameField,
  username: usernameField,
  email: emailField,
  phone: phoneField,
  address: addressField,
  about: aboutField,
  birthDate: birthDateField,
  interests: interestsField,
  achievements: achievementsField,
});


module.exports = {
  editUserProfilevalidation: editUserProfileSchema,
};
