import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';
import {
  NativeModules,
  View,
  Text,
  TouchableNativeFeedback,
  Image,
} from 'react-native';

import styles from './styles';

import dropDownImageWhite from './drop-down-arrow-white.png';
import dropDownImageBlack from './drop-down-arrow-black.png';


const THEMES = {
  LIGHT: 0,
  DARK: 1,
};


class Picker extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onPressPicker = (values, labels) => () => {
    NativeModules.FixedAndroidPicker.showPickerDialog(labels).then((index) => {
      this.setState({
        selectedValue: values[index],
      });
      this.props.onValueChange(values[index], index);
    }).catch((error) => {
      //dialog closed
    });
  }

  getTheme = () => {
    return this.props.theme;
  }

  render() {
    const items = this.props.items;
    const labels = this.getLabels(items);
    const values = this.getValues(items);

    const renderDropDown = this.props.renderDropDown ?
      this.props.renderDropDown : this.renderDropDown;

    return (
      <View
        style={this.getTheme() == THEMES.LIGHT ? styles.backgroundWhite : styles.backgroundBlack}>
        <TouchableNativeFeedback
          underlayColor={this.getTheme() == THEMES.LIGHT ? '#FFFFFF' : '#000000'}
          style={styles.padding5}
          onPress={this.onPressPicker(values, labels)}>

            {
              this.renderDropDown(labels, values)
            }

        </TouchableNativeFeedback>
      </View>
    );
  }

  renderDropDown = (labels, values) => {
    return (
      <View
        style={[
          styles.flexDirectionRow,
          styles.alignItemsCenter,
        ]}>
          <Text
            style={[
              this.props.theme == THEMES.LIGHT ? styles.fontBlack : styles.fontWhite,
              this.props.styles.label,
            ]}>
            {
              labels[values.indexOf(this.state.selectedValue ? this.state.selectedValue : this.props.selectedValue)]
            }
        </Text>

        <Image
          source={this.getDropDownSource()}
          style={[
            styles.dropDownImage,
            styles.marginLeft5,
            this.props.styles.icon,
          ]}
          />
      </View>
    );
  }

  getDropDownSource = () => {
    let dropDownImageSource;
    if (this.props.dropDownImageSource) {
      dropDownImageSource = this.props.dropDownImageSource;
    } else if (this.getTheme() == THEMES.LIGHT) {
      dropDownImageSource = dropDownImageBlack;
    } else {
      dropDownImageSource = dropDownImageWhite;
    }
    return dropDownImageSource;
  }

  getLabels = (items) => {
    return items.map((item) => {
      return item.label;
    });
  }

  getValues = (items) => {
    return items.map((item) => {
      return item.value;
    });
  }
}

Picker.propTypes = {
  selectedValue: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  onValueChange: PropTypes.func.isRequired,
  dropDownImageSource: PropTypes.oneOfType([
    PropTypes.shape({
      uri: PropTypes.string.isRequired,
    }).isRequired,
    PropTypes.number.isRequired,
  ]),
  theme: PropTypes.number,
  styles: PropTypes.shape({
    icon: PropTypes.number,
    label: PropTypes.number,
  }),
  renderDropDown: PropTypes.func,
};

Picker.defaultProps = {
  theme: THEMES.LIGHT,
  styles: {},
};


export {
  THEMES as Themes,
};
export default Picker
