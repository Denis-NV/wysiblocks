mongo -- "$MONGO_INITDB_DATABASE" <<EOF
    var rootUser = '$MONGO_INITDB_ROOT_USERNAME';
    var rootPassword = '$MONGO_INITDB_ROOT_PASSWORD';
    var admin = db.getSiblingDB('admin');
    admin.auth(rootUser, rootPassword);

    var strapi_cms_db = '$MONGO_STRAPI_CMS_DB';
    var strapi_cms_user = '$MONGO_STRAPI_CMS_USER';
    var strapi_cms_pass = '$MONGO_STRAPI_CMS_PASS';
    var strapi_cms = db.getSiblingDB(strapi_cms_db);
    
    strapi_cms.createUser({user: strapi_cms_user, pwd: strapi_cms_pass, roles: [{
      role: "readWrite",
      db: strapi_cms_db,
    }]});
EOF