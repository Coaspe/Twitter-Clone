import { intArg, nullable, queryType, stringArg } from 'nexus'
import { getUserId } from '../utils'

// t.field('실제로 query 보낼 떄 쓸 이름`.{type:'query가 가져다 주는 data의 type'})
//   query{
//     me{
//       ~~~
//         }
// }}
// type query{me : User}
export const Query = queryType({
  definition(t) {
    t.nullable.field('me', {
      type: 'User',
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        return ctx.prisma.user.findUnique({
          where: {
            id: Number(userId),
          },
        })
      },
    })

    t.list.field('users', {
      type: 'User',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.user.findMany()
      },
    })

    t.list.field('tweets', {
      type: 'Tweet',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.tweet.findMany()
      },
    })

    t.nullable.field("tweet", {
      type: "Tweet",
      args: { id: intArg() },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.tweet.findUnique({
          where: {
            id : Number(id)
          }
        })
      }
    })
    t.nullable.field("user", {
      type: "User",
      args: { id: intArg() },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.user.findUnique({
          where: {
            id: Number(id)
          }
        })
      }
    })
    // t.list.field('filterPosts', {
    //   type: 'Post',
    //   args: {
    //     searchString: nullable(stringArg()),
    //   },
    //   resolve: (parent, { searchString }, ctx) => {
    //     return ctx.prisma.post.findMany({
    //       where: {
    //         OR: [
    //           {
    //             title: {
    //               contains: searchString || undefined,
    //             },
    //           },
    //           {
    //             content: {
    //               contains: searchString ?? undefined,
    //             },
    //           },
    //         ],
    //       },
    //     })
    //   },
    // })

    // t.nullable.field('post', {
    //   type: 'Post',
    //   args: { id: intArg() },
    //   resolve: (parent, { id }, ctx) => {
    //     return ctx.prisma.post.findUnique({
    //       where: {
    //         id: Number(id),
    //       },
    //     })
    //   },
    // })
  },
})
