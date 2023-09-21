import css from "./dialog.module.css";

export default function Dialog({ class_name, children }) {
  return <div className={css[class_name]}>{children}</div>;
}
