// AlertDialogDemo.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// ^ RTL helpers:
// - render: mount a component in a fake browser (JSDOM)
// - screen: query the rendered DOM
// - fireEvent: simulate user actions (click/change/etc.)
// - waitFor: wait for async updates (promises, state changes)

import { AlertDialogDemo } from "../_comps/matud";
// ^ The component you want to test.

import { createClient } from "../utils/supabase/client";
// ^ We import this so we can mock the module your component uses.
//   Your component calls `createClient()` to get a Supabase client.

import { useUploadStore } from "../_store/uploadstore";
// ^ Zustand store your component touches (`setUploadSuccess`).

// ---------------------------
// Mock Supabase module
// ---------------------------
jest.mock("../utils/supabase/client.ts", () => {
  // Create spies we can assert on later if needed:
  const uploadMock = jest.fn().mockResolvedValue({
    data: { path: "testpath" }, // what Supabase would normally return
    error: null,
  });
  const insertMock = jest.fn().mockResolvedValue({
    error: null, // emulate a successful DB insert
  });

  // Return a fake "createClient" that returns only the methods your
  // component actually uses: `storage.from().upload` and `from().insert`.
  return {
    createClient: () => ({
      storage: {
        from: jest.fn().mockReturnThis(),
        upload: jest
          .fn()
          .mockResolvedValue({ data: { path: "fake-path" }, error: null }),
      },
      from: () => ({
        insert: insertMock,
      }),
    }),
  };
});
// ^ Why mock? So the test never talks to real Supabase.
//   We fully control success/failure and keep tests fast and deterministic.

// ---------------------------
// Mock Zustand store used by the component
// ---------------------------
jest.mock("../_store/uploadstore.tsx", () => {
  const setUploadSuccess = jest.fn();

  return {
    __esModule: true,
    useUploadStore: {
      getState: () => ({ setUploadSuccess }), // ✅ mock matches your component usage
    },
  };
});

// ^ This replaces the real store module with a tiny fake that exposes only
//   what the component reads: `getState().setUploadSuccess`.

// ---------------------------
// The actual test
// ---------------------------
describe("AlertDialogDemo", () => {
  it("uploads file and saves metadata", async () => {
    render(<AlertDialogDemo />);

    // ^ Mount the component in JSDOM so we can interact with it.

    fireEvent.click(screen.getByText("Upload Document"));
    // ^ Your UI uses an AlertDialog with a trigger button labeled "Upload Document".
    //   Clicking it opens the dialog content (file input, tag select, etc.).

    const fileInput = screen.getByLabelText("Document", { selector: "input" });
    // ^ Finds the <input type="file"> by its associated <Label htmlFor="picture">Document</Label>.
    //   `getByLabelText` is robust because it mirrors how screen readers find inputs.

    const testFile = new File(["hello"], "test.pdf", {
      type: "application/pdf",
    });
    // ^ Create a fake File in memory. JSDOM implements the File API.
    //   The first arg is the file contents (Blob parts), then filename and MIME type.

    fireEvent.change(fileInput, { target: { files: [testFile] } });
    // ^ Simulate a user picking a file. This triggers your `handleFileSelect`.

    fireEvent.change(screen.getByPlaceholderText(/file name/i), {
      target: { value: "MyTestDoc" },
    });
    // ^ Type the file name into the text input. Your component stores this in `file`.

    // --- Select a tag (shadcn/ui Select) ---
    fireEvent.click(screen.getByText("Select a tag"));
    // ^ Opens the Select dropdown.

    fireEvent.click(screen.getByText("Legal"));
    // ^ Choose the "Legal" option. This triggers `onValueChange` and sets `selectedTag`.

    fireEvent.click(screen.getByText("Upload"));
    // ^ Click the Upload button. This calls `handleUpload`:
    //   1) sets uploading=true
    //   2) calls supabase.storage.from('docs').upload(...)
    //   3) if success -> setUploadSuccess(true)
    //   4) then supabase.from('documents').insert([...])
    //   5) finally uploading=false

    await waitFor(() => {
      expect(useUploadStore.getState().setUploadSuccess).toHaveBeenCalledWith(
        true
      );
    });
    // ^ Because upload/DB calls are async Promises, we wait until the assertion passes.
    //   This verifies your "happy path": after a successful upload,
    //   you flag success in your Zustand store.
  });
});
