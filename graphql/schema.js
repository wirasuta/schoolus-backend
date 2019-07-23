const { composeWithMongoose } = require('graphql-compose-mongoose')
const { schemaComposer } = require('graphql-compose')

const User = require('../models/User')
const Record = require('../models/AcdRecord')
const Session = require('../models/FocusSess')
const Mark = require('../models/Mark')

const UserTC = composeWithMongoose(User, {})
const SessionTC = composeWithMongoose(Session, {})
const MarkTC = composeWithMongoose(Mark, {})
const RecordTC = composeWithMongoose(Record, {})

// TODO: Use internally saved object id on relation
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

schemaComposer.Query.addFields({
  userById: UserTC.getResolver('findById'),
  userByIds: UserTC.getResolver('findByIds'),
  userOne: UserTC.getResolver('findOne'),
  userMany: UserTC.getResolver('findMany'),
  userCount: UserTC.getResolver('count'),

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
  recordCount: RecordTC.getResolver('count')
})

schemaComposer.Mutation.addFields({
  userCreateOne: UserTC.getResolver('createOne'),
  userCreateMany: UserTC.getResolver('createMany'),
  userUpdateById: UserTC.getResolver('updateById'),
  userUpdateOne: UserTC.getResolver('updateOne'),
  userUpdateMany: UserTC.getResolver('updateMany'),
  userRemoveById: UserTC.getResolver('removeById'),
  userRemoveOne: UserTC.getResolver('removeOne'),
  userRemoveMany: UserTC.getResolver('removeMany'),

  sessionCreateOne: SessionTC.getResolver('createOne'),
  sessionCreateMany: SessionTC.getResolver('createMany'),
  sessionUpdateById: SessionTC.getResolver('updateById'),
  sessionUpdateOne: SessionTC.getResolver('updateOne'),
  sessionUpdateMany: SessionTC.getResolver('updateMany'),
  sessionRemoveById: SessionTC.getResolver('removeById'),
  sessionRemoveOne: SessionTC.getResolver('removeOne'),
  sessionRemoveMany: SessionTC.getResolver('removeMany'),

  markCreateOne: MarkTC.getResolver('createOne'),
  markCreateMany: MarkTC.getResolver('createMany'),
  markUpdateById: MarkTC.getResolver('updateById'),
  markUpdateOne: MarkTC.getResolver('updateOne'),
  markUpdateMany: MarkTC.getResolver('updateMany'),
  markRemoveById: MarkTC.getResolver('removeById'),
  markRemoveOne: MarkTC.getResolver('removeOne'),
  markRemoveMany: MarkTC.getResolver('removeMany'),

  recordCreateOne: RecordTC.getResolver('createOne'),
  recordCreateMany: RecordTC.getResolver('createMany'),
  recordUpdateById: RecordTC.getResolver('updateById'),
  recordUpdateOne: RecordTC.getResolver('updateOne'),
  recordUpdateMany: RecordTC.getResolver('updateMany'),
  recordRemoveById: RecordTC.getResolver('removeById'),
  recordRemoveOne: RecordTC.getResolver('removeOne'),
  recordRemoveMany: RecordTC.getResolver('removeMany')
})

const graphqlSchema = schemaComposer.buildSchema()
module.exports = graphqlSchema
