import { makeStyles, StyleRules } from '@material-ui/styles';

const styles: StyleRules = {
  dateTimeContainer: {
    display: 'flex',
    marginBottom: '35px',
  },
  onCallFormContainer: {
    height: '100%',
    display: 'flex',
  },
  datePickerContainer: {
    width: '140px',
    marginRight: '22px',
  },
  timePickerContainer: {
    width: '140px',
    marginRight: '22px',
    overflowX: 'hidden',
    transition: '0.3s',
  },
  timePickerContainerCollapsed: {
    width: 0,
    marginRight: 0,
  },
  timePickerRoot: {
    width: '140px',
  },
  allDaySwitchContainer: {
    paddingTop: '8px',
  },
};

export default makeStyles(styles);
