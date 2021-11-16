import React, { FC, useEffect } from 'react';
import { createPortal } from 'react-dom';

import Button, { ButtonProps } from '../Button';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Text from '../Text';
import * as Styled from './Modal.styles';

export type modalSize = 'small' | 'medium' | 'large' | 'xlarge';
export interface ModalProps {
  onClose?: () => void;
  title?: string;
  size?: modalSize;
  buttons?: ButtonProps[];
  isDismissible?: boolean;
  portalContainerId?: string;
}

const Modal: FC<ModalProps> = ({
  size = 'medium',
  onClose,
  title = '',
  buttons = [],
  children,
  isDismissible = true,
  portalContainerId = '__next',
}) => {
  const closeOnEscapeKeyDown = (e: KeyboardEvent) => {
    /^Escape$/i.test(e.key) && closeModal();
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const onVeilClose = (e) => {
    /veil/i.test(e?.target?.classList.toString()) && closeModal();
  };

  const closeModal = () => {
    document.body.style.height = '';
    document.body.style.overflow = '';
    onClose && onClose();
  };

  useEffect(() => {
    if (!isDismissible) return;

    // lock window scroll
    document.body.style.height = '100vh';
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', closeOnEscapeKeyDown);
    return function cleanup() {
      // extraneous coverage reporting - implicitly tested
      /* istanbul ignore next */
      window.removeEventListener('keydown', closeOnEscapeKeyDown);
    };
  }, []);

  return createPortal(
    <Styled.veil {...{ ...(isDismissible && { onClick: onVeilClose }) }} data-test="modal-veil">
      <Styled.modal {...{ size }} data-test="modal">
        <Styled.modalHeader>
          <Text type="h2" headingStyle="title">
            {title}
          </Text>
          {isDismissible && (
            <Styled.closeButton {...{ onClick: closeModal }} data-test="modal-close">
              <Icon src={Icons.Cross} size={IconSize.large} />
            </Styled.closeButton>
          )}
        </Styled.modalHeader>
        <Styled.modalBody>{children}</Styled.modalBody>
        <Styled.modalFooter data-test="modal-footer">
          {buttons.map((buttonProps, index) => (
            <Button key={index} {...{ ...buttonProps }} />
          ))}
        </Styled.modalFooter>
      </Styled.modal>
    </Styled.veil>,
    document.getElementById(portalContainerId) as Element,
  );
};

export default Modal;
