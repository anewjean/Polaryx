import { Extension } from "@tiptap/core";
import { NodeSelection, Plugin } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

export const DragHandle = Extension.create({
  name: "dragHandle",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations: (state) => {
            const { doc, selection } = state;
            const decorations: Decoration[] = [];
            let isDragging = false;

            doc.descendants((node, pos) => {
              if (node.type.name === 'doc' || !node.isBlock || node.type.name === 'listItem') {
                return;
              }

              const handle = document.createElement("div");
              handle.className = "drag-handle";
              handle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-grip-vertical text-muted-foreground"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>`;
              handle.draggable = true;

              handle.addEventListener("dragstart", (event) => {
                isDragging = true;
                const { tr } = state;
                const selection = NodeSelection.create(doc, pos);
                const transaction = tr.setSelection(selection);
                this.editor.view.dispatch(transaction);
                event.dataTransfer?.setData("text/plain", "");
              });

              handle.addEventListener("dragend", () => {
                isDragging = false;
              });

              const deco = Decoration.widget(pos + 1, handle, { side: -1 });
              decorations.push(deco);
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

