import RBTree "mo:base/RBTree";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";


actor {

  var question: Text = "Who will be the PM of India in 2029?";
  var votes: RBTree.RBTree<Text, Nat> = RBTree.RBTree(Text.compare);
  
  public query func getQuestion() : async Text { 
    question 
  };


public query func getVotes() : async [(Text, Nat)] {
    let entries = Iter.toArray(votes.entries());
    Debug.print(debug_show(entries));
    entries;
};

   
  public func vote(entry: Text) : async [(Text, Nat)] {

    let votes_for_entry :?Nat = votes.get(entry);
    
    let current_votes_for_entry : Nat = switch votes_for_entry {
      case null 0;
      case (?Nat) Nat;
    };
    votes.put(entry, current_votes_for_entry + 1);

    Iter.toArray(votes.entries())
  };

  public func resetVotes() : async [(Text, Nat)] {
      votes.put("Rahul_Gandhi", 0);
      votes.put("Nitin_Gadkari", 0);
      votes.put("Arvind_Kejariwal", 0);
      Iter.toArray(votes.entries())
  };

};
