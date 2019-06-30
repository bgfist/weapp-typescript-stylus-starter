import { Store, Dispatch, ActionCreator, AnyAction } from "redux"

export { Unsubscribe, Dispatch } from "redux"

export type Store = Store<any, any>

export type State = ReturnType<Store["getState"]>

export type Props = any

export type Config = AnyObject &
  (Page.WXPageConstructorOptions | Component.WXComponentConstructorOptions | Component.WXComponentBehaviorConstructOptions)

export type MapStateToData = (state: State, props?: Props) => AnyObject

export type MapDispatchToActions = (dispatch: Dispatch) => AnyObject

export type AppConfig<D, E> = App.AppInstance<D> & E & { store: Store }

export type ActionCreator = ActionCreator<AnyAction>

export interface ActionCreators {
  [k: string]: ActionCreator<AnyAction>
}
