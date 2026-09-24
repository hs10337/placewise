import { IonToolbar, IonTitle, IonButtons } from '@ionic/react'
import type { ReactNode } from 'react'

export function IOSNavBar({ title, trailing }: { title: string; trailing?: ReactNode }) {
  return <IonToolbar mode="ios" className="ios-nav-bar">
    <IonTitle role="heading" aria-level={1}>{title}</IonTitle>
    {trailing && <IonButtons slot="end">{trailing}</IonButtons>}
  </IonToolbar>
}
