import React from "react";
import PropTypes from "prop-types";

// CSS
import Typography from "@material-ui/core/Typography";

// Components
import SingleLineText from "./SingleLineText";
import MultiLineText from "./MultiLineText";
import FilesUpload from "./FilesUpload";
import DateTime from "./DateTime";
import SelectOther from "./SelectOther";
import Header from "./Header";
import DisplayText from "./DisplayText";
import YesNoBool from "./YesNoBool";

const CustomField = (props) => {
  const {
    field_data,
    value_data,
    block_data,
    id_token,
    onValueChangeCb,
    className,
  } = props;

  const field_list = field_data.call_fieldsList || [];
  const secondary_data = field_list[0] || {};
  const required = field_data.required === 1;
  const type = secondary_data.type || 0;
  const title = field_data.title || secondary_data.title;
  const options = {
    ...JSON.parse(secondary_data.options || "{}"),
    ...JSON.parse(field_data.options || "{}"),
  };

  // Render
  const getSpecificField = (field_type, props) => {
    // console.log(field_type, field_data);

    switch (field_type) {
      case 2:
        return <MultiLineText {...props} />;
      case 4:
        return <YesNoBool {...props} />;
      case 8:
        return (
          <FilesUpload
            {...props}
            upload_url={block_data.files_upload_url}
            id_token={id_token}
          />
        );
      case 13:
        return <SelectOther {...props} />;
      case 16:
        return <DateTime {...props} />;
      case 22:
        return <Header {...props} />;
      case 23:
        return <DisplayText {...props} />;
      default:
        return <SingleLineText {...props} />;
    }
  };

  const showLabel = (type) => {
    return ![22, 23].includes(type);
  };

  return React.useMemo(() => {
    // console.log(type, options);

    return (
      <>
        {type > 0 ? (
          <div className={className}>
            {showLabel(type) && (
              <Typography variant="body2">
                {title}
                {required && ` *`}
              </Typography>
            )}
            {getSpecificField(type, {
              title,
              type,
              required,
              options,
              value_data,
              onValueChangeCb,
            })}
          </div>
        ) : null}
      </>
    );
  }, [value_data.val]);
};

CustomField.propTypes = {
  value_data: PropTypes.object.isRequired,
  field_data: PropTypes.object.isRequired,
  onValueChangeCb: PropTypes.func.isRequired,
  block_data: PropTypes.object.isRequired,
  id_token: PropTypes.string,
};

export default CustomField;
