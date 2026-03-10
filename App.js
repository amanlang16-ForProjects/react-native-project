import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  Pressable,
  Alert,
} from "react-native";

export default function App() {
  const [enteredNoteText, setEnteredNoteText] = useState("");
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  function noteInputHandler(text) {
    setEnteredNoteText(text);
  }

  function addNoteHandler() {
    if (!enteredNoteText.trim()) return;

    setNotes((currentNotes) => [
      ...currentNotes,
      { id: Math.random().toString(), text: enteredNoteText },
    ]);

    setEnteredNoteText("");
  }

  function deleteNoteHandler(id) {
    setNotes((currentNotes) => currentNotes.filter((note) => note.id !== id));

    if (selectedNoteId === id) {
      setSelectedNoteId(null);
      setEnteredNoteText("");
    }
  }

  function confirmDeleteHandler(id) {
    Alert.alert("Delete this note?", "Are you sure you want to delete it?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => deleteNoteHandler(id),
      },
    ]);
  }

  function openNoteHandler(id) {
    const noteToEdit = notes.find((note) => note.id === id);
    if (!noteToEdit) return;

    setSelectedNoteId(id);
    setEnteredNoteText(noteToEdit.text);
  }

  function updateNoteHandler() {
    if (!enteredNoteText.trim()) return;

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === selectedNoteId ? { ...note, text: enteredNoteText } : note,
      ),
    );

    setSelectedNoteId(null);
    setEnteredNoteText("");
  }

  function cancelEditHandler() {
    setSelectedNoteId(null);
    setEnteredNoteText("");
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInputArea}
          placeholder="Add Note!"
          onChangeText={noteInputHandler}
          value={enteredNoteText}
        />

        {selectedNoteId ? (
          <View style={{ gap: 6 }}>
            <Button title="Update" onPress={updateNoteHandler} />
            <Button title="Cancel" onPress={cancelEditHandler} />
          </View>
        ) : (
          <Button title="Add Note" onPress={addNoteHandler} />
        )}
      </View>

      <View style={styles.goalsContainer}>
        <Text style={styles.listTitle}>
          {selectedNoteId ? "Editing Note:" : "List of Notes:"}
        </Text>

        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => openNoteHandler(item.id)}
              onLongPress={() => confirmDeleteHandler(item.id)}
              delayLongPress={300}
              style={({ pressed }) => [
                styles.noteItem,
                selectedNoteId === item.id && styles.selectedItem,
                pressed && styles.pressedItem,
              ]}
            >
              <Text>{item.text}</Text>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    borderBottomWidth: 1,
    padding: 10,
    borderColor: "#dfdfdf",
  },
  textInputArea: {
    borderWidth: 2,
    borderColor: "#dfdfdf",
    width: "60%",
    marginRight: 8,
    padding: 8,
  },
  goalsContainer: {
    flex: 1,
  },
  listTitle: {
    marginBottom: 10,
    fontWeight: "bold",
  },
  noteItem: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 8,
    borderRadius: 6,
  },
  selectedItem: {
    borderColor: "black",
    borderWidth: 2,
  },
  pressedItem: {
    opacity: 0.5,
  },
});
