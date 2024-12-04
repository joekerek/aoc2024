let file = "input.txt"

let read_whole_file filename =
    let ch = open_in filename in
    let s = really_input_string ch (in_channel_length ch) in
    close_in ch;
    s

(* let transpose matrix =
  let rows = Array.length matrix in
  let cols = Array.length matrix.(0) in
  let transposed = Array.make_matrix cols rows ' ' in
  for i = 0 to rows - 1 do
    for j = 0 to cols - 1 do
      transposed.(j).(i) <- matrix.(i).(j)
    done;
  done;
  transposed *)

let rec slice s i n =
  if i > n then []
  else 
    let c = List.nth s i in
    c :: slice s (i + 1) n


let loop_slice s increase n =
  let rec loop s iter n acc =
    if iter >= n - increase then acc
    else
      let sliced = slice s iter (iter + increase) in
      loop s (iter + 1) n (sliced :: acc)
  in
  loop s 0 n []

let part1 = 
  let file_contents = read_whole_file file in
  let lines = String.split_on_char '\n' file_contents in
  let mapped = List.map (fun x ->
    String.fold_right (fun c acc ->
      c :: acc
    ) x [];
  ) lines in
  let slices = List.map (fun x ->
    loop_slice x 3 (List.length x)
  ) mapped in
  let flattened_slices = List.flatten slices in
  let flattened_slices_reverse = List.map (fun x -> List.rev x) flattened_slices in
  let list1 = List.merge (fun x y -> if x < y then -1 else if x = y then 0 else 1) flattened_slices_reverse flattened_slices in
  list1

let () = 
  List.iter (fun x -> List.iter (fun y -> print_char y) x; print_newline ()) part1
