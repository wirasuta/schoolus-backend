const { composeWithMongoose } = require('graphql-compose-mongoose')
const { schemaComposer } = require('graphql-compose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const Record = require('../models/AcdRecord')
const Session = require('../models/FocusSess')
const Mark = require('../models/Mark')
const Voucher = require('../models/Voucher')

const UserTC = composeWithMongoose(User, {})
const SessionTC = composeWithMongoose(Session, {})
const MarkTC = composeWithMongoose(Mark, {})
const RecordTC = composeWithMongoose(Record, {})
const VoucherTC = composeWithMongoose(Voucher, {})
const AuthTC = schemaComposer.createObjectTC(`
  type Auth {
    token: String!
    expires_in: Int!
  }
`)

// Relations
UserTC.addRelation('sessions', {
  resolver: SessionTC.getResolver('findMany'),
  prepareArgs: {
    filter: source => ({
      user: source._id
    })
  },
  projection: { _id: true }
})

UserTC.addRelation('records', {
  resolver: RecordTC.getResolver('findMany'),
  prepareArgs: {
    filter: source => ({
      user: source._id
    })
  },
  projection: { _id: true }
})

RecordTC.addRelation('marks', {
  resolver: MarkTC.getResolver('findMany'),
  prepareArgs: {
    filter: source => ({
      record: source._id
    })
  },
  projection: { _id: true }
})

// Resolver Wrapper
UserTC.wrapResolverResolve('createOne', next => async rp => {
  rp.beforeRecordMutate = async (doc, resolveParams) => {
    doc.password = await bcrypt.hash(doc.password, 12)
    return doc
  }

  // console.log(rp.context.body.isAuth)

  return next(rp)
})

// Custom Resolver
UserTC.addResolver({
  name: 'purchaseVoucher',
  type: UserTC,
  args: { user_id: 'String', voucher_id: 'String' },
  resolve: async ({ source, args, context, info }) => {
    const user = await User.findById(args.user_id, '_id points own_voucher')
    if (!user) throw new Error('User does not exist')

    const voucher = await Voucher.findById(
      args.voucher_id,
      '_id available price'
    )
    if (!voucher || voucher.available <= 0) throw new Error('Voucher invalid')
    if (user.own_voucher.includes(voucher._id)) { throw new Error('You already own this voucher') }
    if (user.points < voucher.price) throw new Error('Insufficent points')
    const voucerupd = await Voucher.updateOne(
      { _id: voucher._id },
      { available: voucher.available - 1 }
    )
    if (!voucerupd) throw new Error('Error purchasing voucher')
    const userupd = await User.updateOne(
      { _id: user._id },
      {
        points: user.points - voucher.price,
        own_voucher: [...user.own_voucher, voucher._id]
      }
    )
    if (!userupd) throw new Error('Error purchasing voucher')
    return User.findById(user._id)
  }
})

AuthTC.addResolver({
  name: 'authUser',
  type: AuthTC,
  args: { user_name: 'String', password: 'String' },
  resolve: async ({ source, args, context, info }) => {
    const user = await User.findOne(
      { user_name: args.user_name },
      '_id user_name password'
    )
    if (!user) throw new Error('User does not exist')
    const eq = await bcrypt.compare(args.password, user.password)
    if (!eq) throw new Error('Wrong password')
    return {
      token: jwt.sign(
        {
          userId: user._id,
          userName: user.user_name
        },
        process.env.APP_SECRET,
        {
          expiresIn: '30d'
        }
      ),
      expires_in: 30
    }
  }
})

const authAccess = resolvers => {
  Object.keys(resolvers).forEach(k => {
    resolvers[k] = resolvers[k].wrapResolve(next => rp => {
      const { isAuth } = rp.context
      if (!isAuth) throw new Error('Not authenticated')

      return next(rp)
    })
  })
  return resolvers
}

schemaComposer.Query.addFields({
  authUser: AuthTC.getResolver('authUser'),

  ...authAccess({
    sessionById: SessionTC.getResolver('findById'),
    sessionByIds: SessionTC.getResolver('findByIds'),
    sessionOne: SessionTC.getResolver('findOne'),
    sessionMany: SessionTC.getResolver('findMany'),
    sessionCount: SessionTC.getResolver('count'),

    markById: MarkTC.getResolver('findById'),
    markByIds: MarkTC.getResolver('findByIds'),
    markOne: MarkTC.getResolver('findOne'),
    markMany: MarkTC.getResolver('findMany'),
    markCount: MarkTC.getResolver('count'),

    recordById: RecordTC.getResolver('findById'),
    recordByIds: RecordTC.getResolver('findByIds'),
    recordOne: RecordTC.getResolver('findOne'),
    recordMany: RecordTC.getResolver('findMany'),
    recordCount: RecordTC.getResolver('count'),

    voucherById: VoucherTC.getResolver('findById'),
    voucherByIds: VoucherTC.getResolver('findByIds'),
    voucherOne: VoucherTC.getResolver('findOne'),
    voucherMany: VoucherTC.getResolver('findMany'),
    voucherCount: VoucherTC.getResolver('count')
  })
})

schemaComposer.Mutation.addFields({
  userCreateOne: UserTC.getResolver('createOne'),
  ...authAccess({
    userPurchaseVoucher: UserTC.getResolver('purchaseVoucher'),

    userUpdateById: UserTC.getResolver('updateById'),
    userRemoveById: UserTC.getResolver('removeById'),

    sessionCreateOne: SessionTC.getResolver('createOne'),
    sessionCreateMany: SessionTC.getResolver('createMany'),

    markCreateOne: MarkTC.getResolver('createOne'),
    markCreateMany: MarkTC.getResolver('createMany'),
    markUpdateById: MarkTC.getResolver('updateById'),
    markUpdateMany: MarkTC.getResolver('updateMany'),
    markRemoveById: MarkTC.getResolver('removeById'),
    markRemoveMany: MarkTC.getResolver('removeMany'),

    recordCreateOne: RecordTC.getResolver('createOne'),
    recordCreateMany: RecordTC.getResolver('createMany'),
    recordUpdateById: RecordTC.getResolver('updateById'),
    recordUpdateMany: RecordTC.getResolver('updateMany'),
    recordRemoveById: RecordTC.getResolver('removeById'),
    recordRemoveMany: RecordTC.getResolver('removeMany')
  }),
  voucherCreateOne: VoucherTC.getResolver('createOne'),
  voucherCreateMany: VoucherTC.getResolver('createMany'),
  voucherUpdateById: VoucherTC.getResolver('updateById'),
  voucherUpdateMany: VoucherTC.getResolver('updateMany'),
  voucherRemoveById: VoucherTC.getResolver('removeById'),
  voucherRemoveMany: VoucherTC.getResolver('removeMany')
})

const graphqlSchema = schemaComposer.buildSchema()
module.exports = graphqlSchema
