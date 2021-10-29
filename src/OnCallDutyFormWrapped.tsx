import React, { memo, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { InjectTranslations } from '@ui-utils/components';
import { useMainContext, useSelectorWithParameters } from '@ui-utils/hooks';

import { fetchTranslationsByPrekey } from 'actions/translations';
import { getTranslations } from 'selectors/translations';

import OnCallDutyForm from './OnCallDutyForm';

const OnCallDutyFormWrapped = () => {
  const dispatch = useDispatch();
  const {
    tenant,
    displayInfo,
    userConfig: { language },
  } = useMainContext();

  const fetchTranslations = useCallback(
    prekeys => dispatch(fetchTranslationsByPrekey(prekeys, displayInfo)),
    [dispatch],
  );

  const translations = useSelectorWithParameters(getTranslations, language);

  useEffect(() => {
    if (isEmpty(translations)) fetchTranslations(['admin.users', 'constant']);
  }, [tenant]);

  return (
    <InjectTranslations translations={translations}>
      <OnCallDutyForm />
    </InjectTranslations>
  );
};

export default memo(OnCallDutyFormWrapped);
