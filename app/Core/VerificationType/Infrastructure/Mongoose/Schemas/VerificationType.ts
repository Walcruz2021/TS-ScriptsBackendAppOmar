import { Schema } from '@ioc:Mongoose'
export const VerificationTypeSchema: Schema = new Schema(
  {
    cropTypes: [
      {
        cropType: {
          type: Schema.Types.ObjectId,
          ref: 'CropType',
          require: true
        },
        key: {
          type: String,
          required: true
        }
      }
    ],
    key: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      en: {
        type: String
      },
      es: {
        type: String
      },
      pt: {
        type: String
      }
    },
    companies: [
      {
        company: {
          type: Schema.Types.ObjectId,
          ref: 'Company',
          require: true,
          index: true
        },
        image: {
          type: String,
          required: true
        },
        identifier: {
          type: String,
          required: true
        },
        name: {
          type: String,
          required: true
        },
        availableCropTypes: [
          {
            type: String
          }
        ]
      }
    ]
  },
  { timestamps: true }
)
