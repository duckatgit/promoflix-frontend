"use client";

import React, { useRef, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Trash,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { NameLogo } from "@/components/ui/name-logo";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Header from "../header/page";

// Mock Data
const data = [
  {
    id: "m5gr84i9",
    status: "success",
    title: "ken99@yahoo.com",
    variable_selected: 2,
    number_of_reciepient: 15,
  },
  {
    id: "3u1reuv4",
    status: "success",
    title: "Abe45@gmail.com",
    variable_selected: 3,
    number_of_reciepient: 20,
  },
  {
    id: "derv1ws0",
    status: "processing",
    title: "Monserrat44@gmail.com",
    variable_selected: 5,
    number_of_reciepient: 17,
  },
  {
    id: "5kma53ae",
    status: "success",
    title: "Silas22@gmail.com",
    variable_selected: 8,
    number_of_reciepient: 14,
  },
  {
    id: "bhqecj4p",
    status: "failed",
    title: "carmella@hotmail.com",
    variable_selected: 4,
    number_of_reciepient: 11,
  },
];

const columns = [
  {
    id: "serial",
    header: "S.No",
    cell: ({ row }) => row.index + 1, // Displaying row index + 1
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Video Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "variable_selected",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Variable Selected
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("variable_selected")}</div>,
  },
  {
    accessorKey: "number_of_reciepient",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Number of Recipients
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("number_of_reciepient")}</div>,
  },
  {
    accessorKey: "action",
    header: () => <div className="text-right">Action</div>,
    cell: ({ row }) => {
      const handleDelete = () => {
        alert("hi");
        // Your delete logic here, e.g., remove the row from data.
      };
      const handleEdit = () => { };
      return (
        <div className="flex justify-end space-x-2">
          <AlertDialog>
            <AlertDialogTrigger>
              <Trash className="h-4 w-4 text-red-500" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete</AlertDialogTitle>
                <AlertDialogDescription>
                  Do you really want to delete this item?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-[#FF2E00]">Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];

const DataTableDemo = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileModal, setFileModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    setFileModal(true);
  };

  const handleFileChange = (event) => {
    const fileInput = event.target;
    if (fileInput.files.length > 0) {
      const selectedFile = fileInput.files[0];
      fileInput.value = null; // Reset the input if the same file is selected again
      setSelectedFile(selectedFile);
    }
  };

  const token = localStorage.getItem("token");
  const handleSendFile = async () => {
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const response = await fetch('http://localhost:3004/api/upload_video', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
        if (!response.ok) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
          });
        }
        const data = await response.json();
        if (data.code !== 200) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
          });
        } else {
          toast({
            description: data.message,
          });
          router.push('/auth/dashboard'); // Redirect to the dashboard page
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    }
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="mx-8">

      <Header />


      <div className="w-full">
        <Button
          className="flex justify-end ml-auto text-black"
          style={{ backgroundColor: "#FFC000" }}
          onClick={handleUploadClick}
        >
          <Upload className="h-4 w-4" />
          Upload Videos
        </Button>

        <Dialog open={fileModal} onOpenChange={setFileModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Video</DialogTitle>
            </DialogHeader>

            {/* Custom Upload Button */}
            <div className="border-2 p-12  gap-4 border-dashed justify-center flex flex-col m-4 items-center">
              <div>
                <Upload className="h-4 w-4" />
              </div>
              <div className="mt-2">Drag and drop file here</div>
              <div className="mt-8">
                <Button
                  className="bg-[#FFC000] text-black"
                  onClick={() => fileInputRef.current.click()} // Trigger the file input on click
                >
                  Upload Video
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="video/*" // Accept video files
                  style={{ display: 'none' }} // Hide the default file input
                />
              </div>
            </div>
            {selectedFile && <p>Selected file: {selectedFile.name}</p>}
            <DialogFooter>
              <Button variant="outline" onClick={() => setFileModal(false)}>
                Cancel
              </Button>
              <Button
                className="bg-[#FFC000] text-black"
                onClick={() => {
                  handleSendFile();
                  setFileModal(false);
                }}
              >
                Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTableDemo;
