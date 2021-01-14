import React, {useContext, useState} from 'react';
import { createAnimation, IonModal, IonButton, IonContent } from '@ionic/react';
import {User} from "./PostProps";
import {IconButton} from "@material-ui/core";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";
import FullscreenExitOutlinedIcon from '@material-ui/icons/FullscreenExitOutlined';

export interface ModalProps {
    id?: string,
}

/*
    The modal window is called in order to show the post in the context of visiting an user profile
    This pops over the current component of the user profile page
 */
export const PhotoModal: React.FC<ModalProps> = ({id}) => {
    const [showModal, setShowModal] = useState(false);

    const enterAnimation = (baseEl: any) => {
        const backdropAnimation = createAnimation()
            .addElement(baseEl.querySelector('ion-backdrop')!)
            .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

        const wrapperAnimation = createAnimation()
            .addElement(baseEl.querySelector('.modal-wrapper')!)
            .keyframes([
                { offset: 0, opacity: '0', transform: 'scale(0)' },
                { offset: 1, opacity: '0.99', transform: 'scale(1)' }
            ]);

        return createAnimation()
            .addElement(baseEl)
            .easing('ease-out')
            .duration(500)
            .addAnimation([backdropAnimation, wrapperAnimation]);
    }

    const leaveAnimation = (baseEl: any) => {
        return enterAnimation(baseEl).direction('reverse');
    }

    return (
        <>
            <IonModal isOpen={showModal} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
                <img src={`https://proiectcolectivmybuddy.s3.eu-central-1.amazonaws.com/testFolder/${id}.jpg`}/>
                <IconButton aria-label="settings" onClick={() => setShowModal(false)}>
                    <FullscreenExitOutlinedIcon/>
                </IconButton>
            </IonModal>
            {/*<IonButton onClick={() => setShowModal(true)}>Open MAP</IonButton>*/}
            <IconButton aria-label="settings" onClick={() => setShowModal(true)}>
                <AspectRatioIcon/>
            </IconButton>
        </>
    );
}
