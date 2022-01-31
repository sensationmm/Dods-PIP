import React, { FC, useEffect } from 'react';
import { createPortal } from 'react-dom';

import Button, { ButtonProps } from '../Button';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Text from '../Text';
import * as Styled from './Modal.styles';

export type modalSize = 'small' | 'medium' | 'large' | 'xlarge';
type modalButtonAlignment = 'center' | 'right';
export interface ModalProps {
  onClose?: () => void;
  title?: string;
  titleIcon?: Icons;
  titleAside?: JSX.Element;
  size?: modalSize;
  buttons?: ButtonProps[];
  buttonAlignment?: modalButtonAlignment;
  isDismissible?: boolean;
  portalContainerId?: string;
  bodyOverflow?: boolean;
}

const Modal: FC<ModalProps> = ({
  size = 'medium',
  onClose,
  title = '',
  titleIcon,
  titleAside,
  buttons = [],
  buttonAlignment = 'center',
  children,
  isDismissible = true,
  portalContainerId = '__next',
  bodyOverflow = false,
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
      document.body.style.overflow = 'unset';
    };
  }, []);

  return createPortal(
    <Styled.veil {...{ ...(isDismissible && { onClick: onVeilClose }) }} data-test="modal-veil">
      <Styled.modal {...{ size }} data-test="modal">
        <Styled.modalHeader>
          <Styled.modalHeaderTitle>
            {titleIcon && <Icon src={titleIcon} size={IconSize.xxlarge} />}
            <Text type="h2" headingStyle="titleLarge">
              {title}
            </Text>
          </Styled.modalHeaderTitle>
          {titleAside && <Styled.titleAside>{titleAside}</Styled.titleAside>}
        </Styled.modalHeader>

        {isDismissible && (
          <Styled.closeButton {...{ onClick: closeModal }} data-test="modal-close">
            <Icon src={Icons.Cross} size={IconSize.large} />
          </Styled.closeButton>
        )}
        <Styled.modalBody canOverflow={bodyOverflow}>{children}</Styled.modalBody>
        {buttons.length > 0 && (
          <Styled.modalFooter data-test="modal-footer" alignment={buttonAlignment}>
            {buttons.map((buttonProps, index) => (
              <Button
                key={index}
                {...{ ...buttonProps }}
                onClick={(e) => {
                  buttonProps.onClick && buttonProps.onClick(e);
                  closeModal();
                }}
              />
            ))}
          </Styled.modalFooter>
        )}
      </Styled.modal>
    </Styled.veil>,
    document.getElementById(portalContainerId) as Element,
  );
};

export default Modal;
