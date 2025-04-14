// import { makeStyles } from "@fluentui/react-components";
// import { Button } from "codicent-app-sdk";
// import React from "react";

// const useStyles = makeStyles({
//    backdrop: {
//       position: "fixed",
//       top: 0,
//       left: 0,
//       width: "100vw",
//       height: "100vh",
//       backgroundColor: "rgba(0, 0, 0, 0.4)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       zIndex: 9999,
//    },
//    dialog: {
//       backgroundColor: "#fff",
//       borderRadius: "4px",
//       boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//       width: "100%",
//       maxWidth: "480px",
//       padding: "24px",
//       position: "relative",
//    },
//    header: {
//       fontSize: "20px",
//       fontWeight: 600,
//       marginBottom: "16px",
//    },
//    body: {
//       fontSize: "16px",
//       marginBottom: "24px",
//    },
//    footer: {
//       display: "flex",
//       justifyContent: "flex-end",
//       gap: "8px",
//    },
//    button: {
//       padding: "8px 16px",
//       fontSize: "14px",
//       borderRadius: "4px",
//       border: "none",
//       cursor: "pointer",
//       backgroundColor: "#0078d4",
//       color: "#fff",
//       "&:hover": {
//          backgroundColor: "#005a9e",
//       },
//    },
//    secondaryButton: {
//       backgroundColor: "#f3f2f1",
//       color: "#323130",
//       "&:hover": {
//          backgroundColor: "#e1dfdd",
//       },
//    },
// }
// );

// export const Dialog: React.FC<{
//    open: boolean;
//    children: React.ReactNode;
// }> = ({ open, children }) => {
//    const classes = useStyles();

//    if (!open) return null;

//    return (
//       <div className={classes.backdrop}>
//          <div className={classes.dialog}>
//             {children}
//          </div>
//       </div>
//    );
// };

// export const DialogActions: React.FC<{
//    children: React.ReactNode;
// }> = ({ children }) => {
//    const classes = useStyles();
//    return <div className={classes.footer}>{children}</div>;
// };

// export const DialogContent: React.FC<{
//    children: React.ReactNode;
// }> = ({ children }) => {
//    const classes = useStyles();
//    return <div className={classes.body}>{children}</div>;
// }

// export const DialogTitle: React.FC<{
//    children: React.ReactNode;
// }> = ({ children }) => {
//    const classes = useStyles();
//    return <div className={classes.header}>{children}</div>;
// }; 