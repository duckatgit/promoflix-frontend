import React, { useEffect, useRef, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash, Upload } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { fetchData, postData, deleteData, putData } from "@/utils/api";
import Image from "next/image";

const Dashboard = ({
  instance,
  setInstance,
  allInstances,
  createInstance,
  getAllInstance,
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [sorting, setSorting] = useState([]);
  const [instanceId, setInstanceId] = useState("");

  const [id, setId] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [fileModal, setFileModal] = useState(false);
  const [uploadFileModal, setUploadFileModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const [updateInstanceModal, setupdateInstanceModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file
  const fileInputRef = useRef(null);
  const handleUploadClick = () => {
    setFileModal(true);
  };
  const handleUploadvideo = () => {
    setUploadFileModal(true);
  };
  let openUpdateInstanceModal = (name, id, e) => {
    e.stopPropagation();
    setInstance(name);

    setInstanceId(id);
    setupdateInstanceModal(true);
  };
  const columns = [
    {
      id: "serial",
      header: "S.No",
      cell: ({ row }) => row.index + 1, // Displaying row index + 1
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "action",
      header: () => <div className="text-right">Action</div>,
      cell: ({ row }) => {
        let instance_id = row.original.id;
        let instance_name = row.getValue("name"); // Assuming "name" is the key for the instance name

        const deleteInstance = async (e) => {
          e.stopPropagation(); // Stop row click event
          try {
            const queryParams = {
              id: instance_id,
            };
            const data = await deleteData(
              "api/v1/instance",
              queryParams,
              "hirello"
            );
            if (data.code != 200) {
              toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: data.result,
              });
            } else {
              toast({
                description: "Instance deleted sucessfully",
              });
              getAllInstance();
            }
          } catch (error) {
            console.log(error);
          }
        };

        return (
          <div className="flex justify-end space-x-2">
            <Edit
              className="h-4 w-4 text-grey cursor-pointer"
              onClick={(e) =>
                openUpdateInstanceModal(instance_name, instance_id, e)
              }
            />
            <AlertDialog>
              <AlertDialogTrigger onClick={(e) => e.stopPropagation()}>
                <Trash className="h-4 w-4 text-red-500" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete</AlertDialogTitle>
                  <AlertDialogDescription>
                    Do you really want to delete this item? ggg
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-[#FF2E00]"
                    onClick={(e) => deleteInstance(e)}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  const updateInstance = async () => {
    try {
      const data = await putData(
        "api/v1/instance",
        {
          id: instanceId,
          name: instance,
          data_id: null,
          video_id: null,
        },
        "hirello"
      );
      if (data.code != 200) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
        });
      } else {
        toast({
          description: "Instence Updated successfully",
        });
        setInstance("");
      }
    } catch (error) {
      console.log(error, "===========error");
    }
  };

  const table = useReactTable({
    data: allInstances,
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
  const getVideo = async (e, row) => {
    try {
      const data = await fetchData(
        `api/v1/file/${row.original.id}`,
        {},
        "hirello"
      );
      if (data.code == 200) {
        router.push(`/video/preview?id=${row.original.id}`);
      }
    } catch (error) {
      console.log(error, "=========error");
      handleUploadvideo();
    }
  };
  useEffect(() => {
    getAllInstance();
  }, []);
  const handleSendFile = async () => {
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        setShowLoader(true);
        const data = await postData(`api/v1/file/${id}`, formData, "hirello");
        if (data.code == 200) {
          setUploadFileModal(false);
          setShowLoader(false);
          setId("");
          router.push(`/video/preview?id=${id}`);
        }
      }
    } catch (error) {
      setShowLoader(false);
      console.log(error, "==========error");
    }
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file); // Store the selected file in state
      const fileInput = event.target;
      if (fileInput.files.length > 0) {
        const selectedFile = fileInput.files[0];
        fileInput.value = null; // Reset the input if the same file is selected again
        setSelectedFile(selectedFile);
      }
    }
  };


  return (
    <>
      <div className="w-full">
        <Button
          className="flex justify-end ml-auto text-black mb-2 gap-2"
          style={{ backgroundColor: "#FFC000" }}
          onClick={handleUploadClick}
        >
          <Upload className="h-4 w-4" />
          <span>Create Instance</span>
        </Button>

        <Dialog open={uploadFileModal} onOpenChange={setUploadFileModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Video</DialogTitle>
            </DialogHeader>

            <div className="gap-4 border-dashed justify-center flex flex-col m-4 items-center">
              {showLoader && (
                <div className="flex absolute w-full top-0 bottom-0 justify-center bg-gray-300 bg-opacity-50 ">
                  <Image
                    src="/assets/tube-spinner.svg"
                    alt="Logo"
                    width={50}
                    height={50}
                  />
                </div>
              )}

              <div>
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }} // Hide the input
                  id="file-upload" // Add an ID to associate with the label
                />
                {/* Label styled as a button */}
                <label
                  htmlFor="file-upload"
                  className="bg-gray-200 p-2 border-dashed border-2 rounded cursor-pointer"
                >
                  Choose a file
                </label>
              </div>
              {/* Show the selected file name */}
              {selectedFile?.name && <p>{selectedFile.name}</p>}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setUploadFileModal(false);
                  setShowLoader(false);
                  setSelectedFile(null);
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#FFC000] text-black"
                onClick={() => {
                  handleSendFile();
                }}
              >
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={fileModal} onOpenChange={setFileModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Instance</DialogTitle>
            </DialogHeader>
            <div className="gap-4 border-dashed justify-center flex flex-col m-4 items-center">
              <div className="flex flex-col space-y-1.5 w-[400px]">
                <input
                  className="h-10 rounded-md pl-3"
                  type="text"
                  value={instance}
                  onChange={(e) => {
                    setInstance(e.target.value);
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setFileModal(false);
                  setInstance("");
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#FFC000] text-black"
                onClick={() => {
                  createInstance();
                  setFileModal(false);
                  getAllInstance();
                }}
              >
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog
          open={updateInstanceModal}
          onOpenChange={setupdateInstanceModal}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Video Title</DialogTitle>
            </DialogHeader>
            <div className="gap-4 border-dashed justify-center flex flex-col m-4 items-center">
              <div className="flex flex-col space-y-1.5 w-[400px]">
                <input
                  className="h-10 rounded-md"
                  type="text"
                  value={instance}
                  onChange={(e) => {
                    setInstance(e.target.value);
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setupdateInstanceModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#FFC000] text-black"
                onClick={() => {
                  updateInstance();
                  setupdateInstanceModal(false);
                  getAllInstance();
                }}
              >
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                className="cursor-pointer"
                key={row.id}
                onClick={(e) => {
                  setId(row?.original?.id), getVideo(e, row);
                }}
              >
                {row.getVisibleCells().map((cell) => (
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
    </>
  );
};

export default Dashboard;
