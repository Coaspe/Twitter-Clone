import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { intArg, mutationType, nonNull, nullable, stringArg } from 'nexus'
import { APP_SECRET, getUserId } from '../utils'

export const Mutation = mutationType({
  definition(t) {
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        name: stringArg(),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, { name, email, password }, ctx) => {
        const hashedPassword = await hash(password, 10)
        const user = await ctx.prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        })
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })

    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, { email, password }, ctx) => {
        const user = await ctx.prisma.user.findUnique({
          where: {
            email,
          },
        })
        if (!user) {
          throw new Error(`No user found for email: ${email}`)
        }
        const passwordValid = await compare(password, user.password)
        if (!passwordValid) {
          throw new Error('Invalid password')
        }
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })
    t.field("createProfile", {
			type: "Profile",
			args: {
				bio: stringArg(),
				location: stringArg(),
				website: stringArg(),
				avatar: stringArg()
			},
			resolve: (parent, args, ctx) => {
				const userId = getUserId(ctx)
				if (!userId) throw new Error("Could not authenticate user.")
				return ctx.prisma.profile.create({
					data: {
						...args,
						User: { connect: { id: Number(userId) } }
					}
				})
			}
    })
    t.field("updateProfile", {
			type: "Profile",
      args: {
        id: intArg(),
				bio: stringArg(),
				location: stringArg(),
				website: stringArg(),
				avatar: stringArg()
			},
			resolve: (parent, {id, ...args}, ctx) => {
				const userId = getUserId(ctx)
				if (!userId) throw new Error("Could not authenticate user.")
				return ctx.prisma.profile.update({
					data: {
						...args,
          },
          where: {
            id: Number(id)
          }
				})
			}
    })
    t.field('createComment', {
      type: 'Comment',
      args: {
        content: stringArg(),
        id: intArg()
      },
      resolve: (parent, { content, id }, ctx) => {
        const userId = getUserId(ctx)
        if(!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.comment.create({
          data: {
            content: content as string,
            User: {connect: { id: Number(userId) } },
            Tweet: { connect: { id: Number(id) } },
            //User와 Tweet은 id를 이용해서 찾아준다.
          },
        })
      },
    })
    t.field('createTweet', {
      type: 'Tweet',
      args: {
        content: stringArg(),
      },
      resolve: (parent, { content }, ctx) => {
        const userId = getUserId(ctx)
        if(!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.tweet.create({
          data: {
            content : content as string,
            author: {connect: {id : Number(userId)}}
          },
        })
      },
    })
    t.field('likeTweet', {
      type: 'LikedTweet',
      args: {
        id: intArg(),
      },
      resolve: (parent, { id }, ctx) => {
        const userId = getUserId(ctx)
        if(!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.likedTweet.create({
          data: {
            tweet: {connect: {id : Number(id)}},
            User: {connect: {id : Number(userId)}}
          },
        })
      },
    })
    t.field('deleteTweet', {
      type: 'LikedTweet', //return type of query
      args: {
        id: intArg(),
      },
      resolve: (parent, { id }, ctx) => {
        const userId = getUserId(ctx)
        if(!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.likedTweet.delete({
          where: { id : id as number }
        })
      },
    })
     t.field('createReply', {
      type: 'Comment',
      args: {
        content: nonNull(stringArg()),
        id: nonNull(intArg()),
        commentID: intArg()
      },
      resolve: (parent, { content, id , commentID}, ctx) => {
        console.log(ctx);
        const userId = getUserId(ctx)
        if(!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.comment.create({
          data: {
            content: content as string,
            User: { connect: { id: Number(userId) } },
            Tweet: { connect: { id: Number(id) } },
            Comment: {connect: {id: Number(commentID)}}
            //User와 Tweet은 id를 이용해서 찾아준다.
          },
        })
      },
     })
      t.field('follow', {
      type: 'Following',
      args: {
        name: nonNull(stringArg()),
        followId: nonNull(intArg()),
        avatar: stringArg()
      },
      resolve: (parent, { name, followId , avatar}, ctx) => {
        console.log(ctx);
        const userId = getUserId(ctx)
        if(!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.following.create({
          data: {
            name: name as string,
            avatar: avatar as string,
            followId,
            User: { connect: { id: Number(userId) } },
            //User와 Tweet은 id를 이용해서 찾아준다.
          },
        })
      },
      })
        t.field('deleteFollow', {
      type: 'Following', //return type of query
      args: {
        id: nonNull(intArg()),
      },
      resolve: (parent, { id }, ctx) => {
        const userId = getUserId(ctx)
        if(!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.following.delete({
          where: { id : id as number }
        })
      },
    })

  },
})
