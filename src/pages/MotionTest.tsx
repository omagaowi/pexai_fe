import React, { useEffect, useState } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";

const MotionTest = () => {
  const [isExpanded, setExpanded] = useState(false);
  const [items, setItems] = useState([1, 2, 3]);

  useEffect(() => {
    if (isExpanded) {
      setItems([...items, 4, 5, 6]);
    } else {
      setItems([1, 2, 3]);
    }
    // setItems([...items, 4, 5, 6])
  }, [isExpanded]);

  return (
    <div className="w-[100vw] h-[100vh]">
      <button onClick={() => setExpanded((prev) => !prev)}>
        {isExpanded ? "Show List" : "Show Grid"}
      </button>
      <LayoutGroup>
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: isExpanded
              ? "repeat(3, 1fr)"
              : "repeat(3, 1fr)",
            gap: "10px",
          }}
        >
          <AnimatePresence>
            {items.map((img, index) => (
              <motion.div
                key={img}
                initial={{ opacity: 0, y: '-20px' }}
                animate={{ opacity: 1,  y: '0px' }}
                exit={{ opacity: 0, y: '-20px' }}
                transition={{ duration: 0.3, delay: index / 10  }}
                className="h-[100px] bg-amber-300"
                layout
              ></motion.div>
            ))}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </div>
  );
};

export default MotionTest;

// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence, useAnimation } from "framer-motion";

// function MotionTest() {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div>
//       <motion.button
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//         onClick={() => setIsOpen(true)}
//         style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
//       >
//         Open Modal
//       </motion.button>

//       <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />
//     </div>
//   );
// }

// function Modal({ isOpen, onClose }) {
//   const controls = useAnimation();

//   useEffect(() => {
//     if (isOpen) {
//       async function runSequence() {
//         await controls.start({
//           scale: 1.1,
//           transition: { type: "spring", stiffness: 300, damping: 20 },
//         });
//         // controls.start({ scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } });
//       }
//       runSequence();
//     }
//   }, [isOpen, controls]);

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           key="backdrop"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           onClick={onClose}
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             background: "rgba(0,0,0,0.5)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <motion.div
//             key="modal"
//             initial={{ scale: 0 }}
//             animate={controls}
//             exit={{ scale: 0, opacity: 0 }}
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               background: "#fff",
//               padding: "20px",
//               width: "300px",
//               borderRadius: "8px",
//               textAlign: "center",
//             }}
//           >
//             <h2>Springy Modal</h2>
//             <p>This modal opens with a nice spring overshoot!</p>
//             <button onClick={onClose} style={{ marginTop: "10px", padding: "8px 16px" }}>
//               Close
//             </button>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }

// export default MotionTest;
