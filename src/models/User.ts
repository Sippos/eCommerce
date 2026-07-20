import  mongoose  from 'mongoose'

const userSchema = new mongoose.Schema (
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
            minLength: 6,
            select: false,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_document, returnedObject) => {
                const { _id, __v, password, ...publicUser } =
                returnedObject

                return {
                    id: _id.toString(),
                    ...publicUser,
                }
            }
        }
    },
)

export const User = mongoose.model("User", userSchema)