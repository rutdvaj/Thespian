import { User } from "@supabase/supabase-js";
import { useAuthStore } from "../_store/userstore";

describe("Auth Store", () => {
  it("sets the user correctly", () => {
    const store = useAuthStore.getState();
    const mockUser = { email: "test@example.com" } as unknown as User;
    store.setUser(mockUser);

    expect(useAuthStore.getState().user).toEqual(mockUser);
  });

  it("logs out user", () => {
    const store = useAuthStore.getState();
    store.setUser(null);

    expect(useAuthStore.getState().user).toBeNull();
  });
});
