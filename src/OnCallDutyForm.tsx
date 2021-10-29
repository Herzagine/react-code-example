import React, { memo, useCallback } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { useMainContext, useTranslatedLabels } from '@ui-utils/hooks';
import { OverlayContent } from '@ui-utils/components';

import { useErrorMessageLabels } from 'hooks/useErrorMessageLabels';
import { useOnCallAvailabilityValidators } from 'validation/onCallAvailability';
import defaultTranslations from 'constants/translations/resources';
import {
  createOnCallAvailability,
  resetOnCallAvailability,
  setOnCallAvailabilityFieldValidation,
} from 'actions/resourceUser';
import {
  getOnCallTagId,
  getOnCallAvailability,
  getResourceLocationTimeZoneId,
  getIsOnCallAvailabilitySaving,
} from 'selectors/resourceUser';

import Form from './Form';
import useStyles from './style';

const MemoizedOverlayContent = memo(OverlayContent);

const OnCallDutyForm = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { toggleOverlay, displayInfo, tenant } = useMainContext();

  const labels = useTranslatedLabels({
    titleAdd: 'titleAdd',
    saveButton: 'saveButton',
    cancelButton: 'cancelButton',
  }, defaultTranslations, 'admin.users.form.onCallDuty.form');

  const onCallTagId = useSelector(getOnCallTagId);
  const timeZoneId = useSelector(getResourceLocationTimeZoneId);
  const onCallAvailability = useSelector(getOnCallAvailability) as any;
  const isOnCallAvailabilitySaving = useSelector(getIsOnCallAvailabilitySaving);

  const errorMessageLabels = useErrorMessageLabels();
  const validators = useOnCallAvailabilityValidators(errorMessageLabels);

  const validateForm = useCallback(({
    isAllDay,
    dateFrom,
    dateTo,
    timeFrom,
    timeTo,
  }) => {
    const validationResultsMap = {
      dateFrom: validators.dateFrom(dateFrom),
      dateTo: validators.dateTo(dateTo),
      timeFrom: validators.timeFrom(timeFrom, isAllDay),
      timeTo: validators.timeTo(timeTo, isAllDay),
    };

    batch(() => Object.entries(validationResultsMap).forEach(([field, validationResult]) => (
      dispatch(setOnCallAvailabilityFieldValidation(field, validationResult))
    )));

    return Object.values(validationResultsMap).every(
      validationResult => validationResult.isValid
    );
  }, [validators]);

  const onCancel = useCallback(() => {
    dispatch(resetOnCallAvailability());
    toggleOverlay({ isOverlayOpen: false }, true);
  }, []);

  const onConfirm = useCallback(() => {
    const isFormValid = validateForm(onCallAvailability);
    if (!isFormValid) return;

    dispatch(createOnCallAvailability({
      tenant,
      timeZoneId,
      displayInfo,
      toggleOverlay,
      onCallAvailability,
      tags: [onCallTagId],
    }));
  }, [validateForm, onCallAvailability, onCallTagId]);

  return (
    <MemoizedOverlayContent
      onCancel={onCancel}
      onConfirm={onConfirm}
      headerTitle={labels.titleAdd}
      isLoading={isOnCallAvailabilitySaving}
      confirmButtonTitle={labels.saveButton}
      cancelButtonTitle={labels.cancelButton}
      scrollbarContainerCustomClasses={classes.scrollbarRoot}
    >
      <Form />
    </MemoizedOverlayContent>
  );
};

export default memo(OnCallDutyForm);
