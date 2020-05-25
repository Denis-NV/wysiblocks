mongo -- "$MONGO_INITDB_DATABASE" <<EOF
    var rootUser = '$MONGO_INITDB_ROOT_USERNAME';
    var rootPassword = '$MONGO_INITDB_ROOT_PASSWORD';
    var admin = db.getSiblingDB('admin');
    admin.auth(rootUser, rootPassword);


    var core_api_db = '$MONGO_CORE_API_DB';
    var core_api_user = '$MONGO_CORE_API_USER';
    var core_api_pass = '$MONGO_CORE_API_PASS';
    var core_api = db.getSiblingDB(core_api_db);
    
    core_api.createUser({user: core_api_user, pwd: core_api_pass, roles: [{
      role: "readWrite",
      db: core_api_db,
    }]});

    var strapi_cms_db = '$MONGO_STRAPI_CMS_DB';
    var strapi_cms_user = '$MONGO_STRAPI_CMS_USER';
    var strapi_cms_pass = '$MONGO_STRAPI_CMS_PASS';
    var strapi_cms = db.getSiblingDB(strapi_cms_db);
    
    strapi_cms.createUser({user: strapi_cms_user, pwd: strapi_cms_pass, roles: [{
      role: "readWrite",
      db: strapi_cms_db,
    }]});
EOF