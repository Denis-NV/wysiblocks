db = db.getSiblingDB("strapi_cms");

db.createUser({
  user: "strapi",
  pwd: "user_stories_strapi",
  roles: [
    {
      role: "readWrite",
      db: "strapi_cms",
    },
  ],
});
