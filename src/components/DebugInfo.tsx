// import { useEffect, useState } from "react";
// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogBody,
//   DialogContent,
//   DialogSurface,
//   DialogTitle,
//   DialogTrigger,
//   Input,
//   Image,
//   Label,
//   makeStyles,
// } from "@fluentui/react-components";
// import { CodicentAppState, useAuthState, useStateWithLocalStorage, useToaster } from "codicent-app-sdk";
// import { useAuth0 } from "@auth0/auth0-react";

// const useStyles = makeStyles({
//   tasks: {
//     display: "flex",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: "10px",
//   },
//   newAppDialogContent: {
//     display: "flex",
//     flexDirection: "column",
//     rowGap: "10px",
//   },
//   greyBackground: {
//     backgroundColor: "#e5e5e5",
//     padding: "16px",
//     marginBottom: "16px",
//     whiteSpace: "pre-wrap",
//   },
//   selectableText: {
//     userSelect: "text",
//     WebkitUserSelect: "text",
//     msUserSelect: "text",
//     overflow: "auto",
//     maxHeight: "calc(100vh)",
//     padding: "8px",
//     wordBreak: "break-all",
//     wordWrap: "break-word",
//   },
//   previewColor: {
//     margin: "10px 0",
//     width: "32px",
//     height: "32px",
//     borderRadius: "4px",
//     border: "1px solid #ccc",
//   },
// });

// const NewAppDialog = ({
//   onCreate,
//   open,
//   onClose,
// }: {
//   onCreate: (title: string, url: string) => Promise<void>;
//   onClose: () => void;
//   open: boolean;
// }) => {
//   const styles = useStyles();
//   const [title, setTitle] = useState("");
//   const [url, setUrl] = useState("");

//   const handleSubmit = async (ev: React.FormEvent) => {
//     ev.preventDefault();
//     await onCreate(title, url);
//     setTitle("");
//     setUrl("");
//     alert("Created new app button");
//   };

//   return (
//     <Dialog
//       open={open}
//       modalType="non-modal"
//       onOpenChange={(_event, data) => {
//         if (!data.open) {
//           onClose();
//         }
//       }}
//     >
//       {/* <DialogTrigger disableButtonEnhancement>
//         <Button>Button definition</Button>
//       </DialogTrigger> */}
//       <DialogSurface aria-describedby={undefined}>
//         <form onSubmit={handleSubmit}>
//           <DialogBody>
//             <DialogTitle>Title</DialogTitle>
//             <DialogContent className={styles.newAppDialogContent}>
//               <Label required htmlFor={"button-title"}>
//                 Title
//               </Label>
//               <Input
//                 required
//                 type="text"
//                 id={"button-title"}
//                 value={title}
//                 onChange={(_ev, data) => setTitle(data.value)}
//               />
//               <Label required htmlFor={"button-url"}>
//                 Url
//               </Label>
//               <Input required type="text" id={"button-url"} value={url} onChange={(_ev, data) => setUrl(data.value)} />
//             </DialogContent>
//             <DialogActions>
//               <DialogTrigger disableButtonEnhancement>
//                 <Button appearance="secondary">Close</Button>
//               </DialogTrigger>
//               <Button type="submit" appearance="primary">
//                 Save
//               </Button>
//             </DialogActions>
//           </DialogBody>
//         </form>
//       </DialogSurface>
//     </Dialog>
//   );
// };

// const DebugInfo: React.FC<{ state: CodicentAppState }> = ({ state }) => {
//   const auth0 = useAuth0();
//   const { isAuthenticated, isLoading, accessToken, nickname } = useAuthState(auth0);
//   const { service, stateMachine } = state;
//   const { setSelectedApp } = stateMachine;
//   const { selectedApp, apps } = state.context;
//   const [appTheme, setAppTheme] = useStateWithLocalStorage<MessageData | null>("app-theme", null);
//   const [appButtons, setAppButtons] = useStateWithLocalStorage<MessageData[]>("app-buttons", []);
//   const [showNewAppDialog, setShowNewAppDialog] = useState(false);
//   const styles = useStyles();
//   const [chatInstructions, setChatInstructions] = useState<string>();
//   const toaster = useToaster();

//   useEffect(() => {
//     service.getAppTheme().then(setAppTheme);
//     service.getAppButtons().then(setAppButtons);
//     service.getChatInstructions().then(setChatInstructions);
//   }, [setAppButtons, setAppTheme, service]);

//   if (isLoading) {
//     return <div>Laddar...</div>;
//   }

//   // TODO: move to service
//   const clearAppButtons = async () => {
//     const datas = await window.Codicent.getDataMessages({ tags: ["app-button"], codicent: selectedApp! });
//     for (const data of datas) {
//       await window.Codicent.postMessage({ message: "#hidden", type: "text", parentId: data.id });
//     }
//   };

//   // TODO: move to service
//   const createAppButton = async () => {
//     await createCustomAppButton(
//       "Spara företagsinfo",
//       "/chat?text=Hej! Jag vill spara företagsinfo. Guida mig steg för steg, ett i taget, tills vi har all info om mitt företag. Exempel på data: företagsnamn eller idénamn, org.nr., ägare, kontaktinformation, vision, affärsidé, mm."
//     );
//   };

//   const createCustomAppButton = async (title: string, url: string) => {
//     setShowNewAppDialog(false);
//     const text = `#data #app-button
//       {
//       "title": "${title}",
//       "url": "${url}"
//       }`;
//     await window.Codicent.postMessage({ message: `@${selectedApp} ${text}`, type: "text" });
//   };

//   return (
//     isAuthenticated && (
//       <div className={styles.selectableText}>
//         <h3>Tasks</h3>
//         <div className={styles.tasks}>
//           <Button size="small" appearance="primary" onClick={clearAppButtons}>
//             Reset app buttons
//           </Button>
//           <Button size="small" appearance="primary" onClick={() => setShowNewAppDialog(true)}>
//             Create custom button
//           </Button>
//           <Button size="small" appearance="primary" onClick={createAppButton}>
//             Create new button
//           </Button>
//         </div>
//         <h3>API Token</h3>
//         <p>{accessToken}</p>
//         <h3>Codicent username</h3>
//         <p>{nickname}</p>
//         <h3>Codicent name</h3>
//         <p>{selectedApp}</p>
//         <h3>Codicent apps</h3>
//         {/* <p>{apps.map((a) => a.title || a.id).join(",")}</p> */}
//         {(apps || []).map((a) => (
//           <Button
//             key={a.id}
//             icon={a.logo ? <Image src={a.logo} height="24px" /> : undefined}
//             onClick={() => setSelectedApp(a.id)}
//             title={a.title || a.id}
//           >
//             {a.title || a.id}
//           </Button>
//         ))}
//         {appTheme && (
//           <>
//             <h3>App Theme</h3>
//             {Object.keys(appTheme).map((key) => (
//               <div key={key}>
//                 <p>
//                   <b>{key}</b>
//                 </p>
//                 <p>{appTheme[key]}</p>
//                 {key.toUpperCase().includes("COLOR") && (
//                   <div
//                     className={styles.previewColor}
//                     style={{ backgroundColor: appTheme[key] }}
//                     onClick={() => {
//                       navigator.clipboard.writeText(appTheme[key]);
//                       toaster.notify("Color copied", appTheme[key], "");
//                     }}
//                   />
//                 )}
//               </div>
//             ))}
//           </>
//         )}
//         {appTheme && (
//           <>
//             <h3>App Buttons</h3>
//             {appButtons.map((button, i) => (
//               <div key={"button_" + i}>
//                 <p>
//                   <b>{button.title}</b>
//                 </p>
//                 <p>{button.url}</p>
//               </div>
//             ))}
//           </>
//         )}
//         {chatInstructions && (
//           <>
//             <h3>Chat Instructions</h3>
//             <pre className={styles.greyBackground}>{chatInstructions}</pre>
//           </>
//         )}
//         <NewAppDialog
//           open={showNewAppDialog}
//           onCreate={createCustomAppButton}
//           onClose={() => setShowNewAppDialog(false)}
//         />
//       </div>
//     )
//   );
// };

// export default DebugInfo;
