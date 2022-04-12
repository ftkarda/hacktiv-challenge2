const { ApolloServer, gql } = require("apollo-server");
const PORT = 4000;
const USERS_URL = "http://localhost:4001";
const MAIN_ENTITY_URL = "http://localhost:4002";
const axios = require("axios");
const redis = require("./config/redisConfig");

const typeDefs = gql`
  type User {
    id: ID
    _id: String
    username: String
    email: String
    role: String
    phoneNumber: String
    address: String
  }

  type Post {
    id: ID
    title: String
    slug: String
    content: String
    imgUrl: String
    categoryId: Int
    authorId: Int
    UserMongoId: String
    Category: Category
    Tags: [Tag]
  }

  type PostDetail {
    id: ID
    title: String
    slug: String
    content: String
    imgUrl: String
    categoryId: Int
    authorId: Int
    UserMongoId: String
    Category: Category
    Tags: [Tag]
    User: User
  }

  type Tag {
    id: ID
    postId: Int
    name: String
  }

  type Category {
    id: ID
    name: String
  }

  type postMessageResponse {
    message: String
  }

  type Query {
    users: [User]
    userDetail(id: ID): User
    posts: [Post]
    postDetail(id: ID): PostDetail
    categories: [Category]
  }

  type Mutation {
    createUser(
      username: String
      email: String!
      password: String!
      role: String
      phoneNumber: String
      address: String
    ): String
    deleteUser(id: ID!): String
    createPost(
      title: String!
      content: String!
      imgUrl: String
      categoryId: Int
      tag1: String!
      tag2: String!
      tag3: String!
      authorId: Int
    ): postMessageResponse
    deletePost(id: ID!): String
    updatePost(
      id: ID!
      title: String!
      content: String!
      imgUrl: String
      categoryId: Int
      tag1: String!
      tag2: String!
      tag3: String!
      authorId: Int
    ): String
  }
`;
const resolvers = {
  Query: {
    users: async () => {
      try {
        const usersCache = await redis.get("users");
        let users = JSON.parse(usersCache);
        if (!usersCache) {
          const response = await axios({
            method: "GET",
            url: USERS_URL + "/users",
          });
          users = response.data;
          await redis.set("users", JSON.stringify(users));
        }
        return users;
      } catch (error) {
        return error;
      }
    },

    userDetail: async (_, args) => {
      try {
        const usersCache = await redis.get("users");
        const users = JSON.parse(usersCache);

        let user;
        if (!users) {
          user = await axios({
            method: "GET",
            url: USERS_URL + `/users/${args.id}`, // mongodbID
          });
          user = user.data;
        } else {
          user = users.find((user) => user._id === args.id);
        }
        return user;
      } catch (error) {
        console.log(error);
        return error;
      }
    },

    posts: async () => {
      try {
        let posts;
        const postsCache = await redis.get("posts");
        if (postsCache) {
          posts = JSON.parse(postsCache);
        } else {
          const response = await axios({
            method: "GET",
            url: MAIN_ENTITY_URL + "/customers/posts",
          });
          posts = response.data;
          redis.set("posts", JSON.stringify(posts));
        }

        return posts;
      } catch (error) {
        console.log(error);
        return error;
      }
    },

    postDetail: async (_, args) => {
      try {
        const postsCache = await redis.get("posts");
        const usersCache = await redis.get("users");
        const posts = JSON.parse(postsCache);
        const users = JSON.parse(usersCache);
        let post;
        let user;
        if (!posts) {
          response = await axios({
            method: "GET",
            url: MAIN_ENTITY_URL + `/customers/posts/${args.id}`,
          });
          post = response.data;
        } else {
          post = posts.find((post) => post.id == args.id);
        }

        if (!users) {
          response = await axios({
            method: "GET",
            url: USERS_URL + `/users/${post.UserMongoId}`,
          });

          user = response.data;
        } else {
          user = users.find((user) => user.id === post.authorId);
        }
        post.User = user;
        return post;
      } catch (error) {
        return error;
      }
    },

    categories: async () => {
      try {
        let categories;
        let response = await redis.get("categories");
        if (response) {
          categories = JSON.parse(response);
        } else {
          response = await axios({
            method: "GET",
            url: MAIN_ENTITY_URL + "/categories",
          });
          categories = response.data;
          redis.set("categories", JSON.stringify(categories));
        }
        return categories;
      } catch (error) {
        return error;
      }
    },
  },

  Mutation: {
    createUser: async (_, args) => {
      try {
        let { username, email, password, role, phoneNumber, address } = args;
        const { data: user } = await axios({
          method: "POST",
          url: USERS_URL + "/users",
          data: { username, email, password, role, phoneNumber, address },
        });
        await redis.del("users");
        return user.message;
      } catch (error) {
        return error;
      }
    },

    deleteUser: async (_, args) => {
      try {
        const { data: user } = await axios({
          method: "DELETE",
          url: USERS_URL + "/users/" + args.id,
        });
        await redis.del("users");
        return user.message;
      } catch (error) {
        return error.message;
      }
    },

    createPost: async (_, args) => {
      try {
        const {
          title,
          content,
          imgUrl,
          categoryId,
          tag1,
          tag2,
          tag3,
          authorId,
        } = args;

        const { data: post } = await axios({
          method: "POST",
          url: MAIN_ENTITY_URL + "/customers/posts",
          data: {
            title,
            content,
            imgUrl,
            categoryId,
            tag1,
            tag2,
            tag3,
            authorId,
          },
        });
        await redis.del("posts");
        return { message: "Product created" };
      } catch (error) {
        return error.message;
      }
    },

    deletePost: async (_, args) => {
      try {
        const { data: post } = await axios({
          method: "DELETE",
          url: MAIN_ENTITY_URL + "/customers/posts/" + args.id,
        });
        await redis.del("posts");
        return post.message;
      } catch (error) {
        return error.message;
      }
    },

    updatePost: async (_, args) => {
      try {
        const {
          title,
          content,
          imgUrl,
          categoryId,
          tag1,
          tag2,
          tag3,
          authorId,
        } = args;

        const { data: post } = await axios({
          method: "PUT",
          url: MAIN_ENTITY_URL + "/customers/posts/" + args.id,
          data: {
            title,
            content,
            imgUrl,
            categoryId,
            tag1,
            tag2,
            tag3,
            authorId,
          },
        });
        await redis.del("posts");
        console.log(post);
        return post.message;
      } catch (error) {
        return error.message;
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

server.listen(PORT).then(({ url }) => {
  console.log(`Server Ready at ${url}`);
});
