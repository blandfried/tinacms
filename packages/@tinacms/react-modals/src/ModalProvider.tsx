/**

Copyright 2019 Forestry.io Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

import * as React from 'react'
import { useCallback, useState, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import styled, { StyledComponent } from 'styled-components'
import { CloseIcon } from '@tinacms/icons'
import { Button, TinaReset } from '@tinacms/styles'
export const Z_INDEX = 2147000000

interface Props {
  children: any
}

export const ModalProvider = ({ children }: Props) => {
  const [modalRootContainerRef, setModalRootContainerRef] = useState(
    null as Element | null
  )

  const setModalRef = useCallback(node => {
    if (node !== null) {
      setModalRootContainerRef(node)
    }
  }, [])

  return (
    <>
      <div id="modal-root" ref={setModalRef} />
      <ModalContainerContext.Provider
        value={{ portalNode: modalRootContainerRef }}
      >
        {...children}
      </ModalContainerContext.Provider>
    </>
  )
}

interface ModalContainerProps {
  portalNode: Element | null
}

const ModalContainerContext = React.createContext<ModalContainerProps | null>(
  null
)

export function useModalContainer(): ModalContainerProps {
  const modalContainer = React.useContext(ModalContainerContext)

  if (!modalContainer) {
    throw new Error('No Modal Container context provided')
  }

  return modalContainer
}

export const Modal = ({
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) => {
  const { portalNode } = useModalContainer()

  return portalNode && portalNode
    ? (createPortal(
        <TinaReset>
          <ModalOverlay>
            <div {...props} />
          </ModalOverlay>
        </TinaReset>,
        portalNode
      ) as any)
    : null
}

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  overflow: auto;
  padding: 0;
  z-index: ${Z_INDEX + 100};
`

const ModalTitle = styled.h2`
  font-size: var(--tina-font-size-4);
  font-weight: var(--tina-font-weight-regular);
  line-height: normal;
  margin: 0;
`

const CloseButton = styled.div`
  display: flex;
  align-items: center;
  fill: var(--tina-color-grey-5);
  cursor: pointer;
  transition: fill 85ms ease-out;
  svg {
    width: 24px;
    height: auto;
  }
  &:hover {
    fill: var(--tina-color-grey-8);
  }
`

export interface ModalHeaderProps {
  children: ReactNode
  close?(): void
}

export const ModalHeader = styled(
  ({ children, close, ...styleProps }: ModalHeaderProps) => {
    return (
      <div {...styleProps}>
        <ModalTitle>{children}</ModalTitle>
        {close && (
          <CloseButton onClick={close}>
            <CloseIcon />
          </CloseButton>
        )}
      </div>
    )
  }
)`
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--tina-padding-big) 0 var(--tina-padding-big);
  border-bottom: 1px solid var(--tina-color-grey-3);
  margin: 0;
`

export const ModalBody = styled.div<{ padded?: boolean }>`
  padding: ${p => (p.padded ? 'var(--tina-padding-big)' : '0')};
  margin: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 160px;

  &:last-child {
    border-radius: 0 0 5px 5px;
  }
`

export const ModalActions: StyledComponent<'div', {}, {}> = styled.div`
  display: flex;
  justify-content: flex-end;
  border-radius: 0 0 5px 5px;
  padding: 0 var(--tina-padding-big) var(--tina-padding-big)
    var(--tina-padding-big);
  ${Button} {
    flex: 0 1 auto;
    min-width: 128px;
    margin: 0 var(--tina-padding-small) 0 0;
    &:last-child {
      margin-right: 0;
    }
  }
`
