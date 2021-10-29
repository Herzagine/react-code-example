import React, { memo, useMemo, useCallback, FC, ChangeEvent } from 'react';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker, TimePicker, SwitchButton } from '@ui-utils/components';
import { useMainContext, useTranslatedLabels } from '@ui-utils/hooks';

import { useErrorMessageLabels } from 'hooks/useErrorMessageLabels';
import { useOnCallAvailabilityValidators, Validator } from 'validation/onCallAvailability';
import defaultTranslations from 'constants/translations/resources';
import { setOnCallAvailabilityField, setOnCallAvailabilityFieldValidation } from 'actions/resourceUser';
import { getOnCallAvailability, getOnCallAvailabilityValidation } from 'selectors/resourceUser';

import useStyles from './style';

interface FormProps {
  disabled?: boolean;
}

const commonTimePickerProps = {
  mask: '--:--',
  maskChar: '-',
  minutesStep: 1,
  customPlaceholder: '',
  hasCustomOnReset: true,
};

const Form: FC<FormProps> = ({ disabled }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    userConfig: {
      dateFormat,
      timeFormat,
      firstDayOfWeek,
    },
  } = useMainContext();

  const labels = useTranslatedLabels({
    allDay: 'allDay',
    toDate: 'toDate',
    toTime: 'toTime',
    fromDate: 'fromDate',
    fromTime: 'fromTime',
  }, defaultTranslations, 'admin.users.form.onCallDuty.form');

  const errorMessageLabels = useErrorMessageLabels();
  const validators = useOnCallAvailabilityValidators(errorMessageLabels);

  const {
    dateTo,
    timeTo,
    isAllDay,
    dateFrom,
    timeFrom,
  } = useSelector(getOnCallAvailability);
  const validation = useSelector(getOnCallAvailabilityValidation);

  const timePickerClasses = useMemo(
    () => ({ root: classes.timePickerRoot }),
    [classes.timePickerRoot],
  );

  const setFieldValue = useCallback((
    field: string,
    value: Date | boolean | null,
    validationResult?: ReturnType<Validator>,
  ) => {
    dispatch(setOnCallAvailabilityField(field, value));
    if (validationResult) dispatch(setOnCallAvailabilityFieldValidation(field, validationResult));
  }, [dispatch]);

  const {
    setDateFrom,
    setDateTo,
    setTimeFrom,
    setTimeTo,
    setIsAllDay,
  } = useMemo(() => ({
    setDateFrom: (date: Date) => setFieldValue('dateFrom', date, validators.dateFrom(date)),
    setDateTo: (date: Date) => setFieldValue('dateTo', date, validators.dateTo(date)),
    setTimeFrom: (time: Date) => setFieldValue('timeFrom', time, validators.timeFrom(time, isAllDay)),
    setTimeTo: (time: Date) => setFieldValue('timeTo', time, validators.timeFrom(time, isAllDay)),
    setIsAllDay: (event: ChangeEvent<HTMLInputElement>) => setFieldValue('isAllDay', event.target.checked),
  }), [setFieldValue, validators, isAllDay]);

  const {
    resetDateFrom,
    resetDateTo,
    resetTimeFrom,
    resetTimeTo,
  } = useMemo(() => ({
    resetDateFrom: () => setFieldValue('dateFrom', null),
    resetDateTo: () => setFieldValue('dateTo', null),
    resetTimeFrom: () => setFieldValue('timeFrom', null),
    resetTimeTo: () => setFieldValue('timeTo', null),
  }), [setFieldValue]);

  return (
    <div className={classes.onCallFormContainer}>
      <div>
        <div className={classes.dateTimeContainer}>
          <div className={classes.datePickerContainer}>
            <DatePicker
              date={dateFrom}
              format={dateFormat}
              setDate={setDateFrom}
              onReset={resetDateFrom}
              isDisabled={disabled}
              firstDayOfWeek={firstDayOfWeek}
              dateLabel={`${labels.fromDate}*`}
              error={!validation.dateFrom.isValid}
              errorText={validation.dateFrom.error}
            />
          </div>
          <div
            className={cx({
              [classes.timePickerContainer]: true,
              [classes.timePickerContainerCollapsed]: isAllDay,
            })}
          >
            <TimePicker
              label={`${labels.fromTime}*`}
              value={timeFrom}
              error={!validation.timeFrom.isValid}
              errorText={validation.timeFrom.error}
              format={timeFormat}
              onChange={setTimeFrom}
              onReset={resetTimeFrom}
              isDisabled={disabled}
              classes={timePickerClasses}
              ampm={timeFormat === 'TIME_FORMAT_12H'}
              {...commonTimePickerProps}
            />
          </div>
        </div>
        <div className={classes.dateTimeContainer}>
          <div className={classes.datePickerContainer}>
            <DatePicker
              date={dateTo}
              format={dateFormat}
              setDate={setDateTo}
              onReset={resetDateTo}
              isDisabled={disabled}
              dateLabel={`${labels.toDate}*`}
              firstDayOfWeek={firstDayOfWeek}
              error={!validation.dateTo.isValid}
              errorText={validation.dateTo.error}
            />
          </div>
          <div
            className={cx({
              [classes.timePickerContainer]: true,
              [classes.timePickerContainerCollapsed]: isAllDay,
            })}
          >
            <TimePicker
              label={`${labels.toTime}*`}
              value={timeTo}
              error={!validation.timeTo.isValid}
              errorText={validation.timeTo.error}
              format={timeFormat}
              onChange={setTimeTo}
              onReset={resetTimeTo}
              isDisabled={disabled}
              classes={timePickerClasses}
              ampm={timeFormat === 'TIME_FORMAT_12H'}
              {...commonTimePickerProps}
            />
          </div>
        </div>
      </div>
      <div className={classes.allDaySwitchContainer}>
        <SwitchButton
          disabled={disabled}
          label={labels.allDay}
          onChange={setIsAllDay}
          checked={isAllDay}
        />
      </div>
    </div>
  );
};

export default memo(Form);
