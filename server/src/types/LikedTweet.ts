import { objectType } from 'nexus'

export const LikedTweet = objectType({
  name: 'LikedTweet',
  definition(t) {
    t.model.id()
    t.model.tweet()
    t.model.likedAt()
  },
})

// type LiekdTwwet {
//     id: id,
//     tweet: Tweet
//     likedAt: likedAt
// }
// t.model
// Only available within objectType definitions.
// https://nexusjs.org/docs/plugins/prisma/api#tmodel model object mapping
// schema.graphql -> types ->  schema.prisma